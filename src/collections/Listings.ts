import { CollectionConfig } from "payload"
import { getUnixTime, fromUnixTime, interval, areIntervalsOverlapping } from "date-fns"

export const Listings: CollectionConfig = {
  slug: "listings",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "organization", "isRemote", "updatedAt"],
    group: "Content",
  },
  access: {
    // Allow anyone to read
    read: () => true,

    // For create, update, and delete, just check if user is authenticated
    create: ({ req }) => {
      // Just check if the user exists (is logged in)
      return Boolean(req.user);
    },
    update: ({ req }) => {
      return Boolean(req.user);
    },
    delete: ({ req }) => {
      return Boolean(req.user);
    },
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
        type: "group",
        name: "location",
        //Need to adapt for listings that can be multiple location types
        //What about in-person but "from anywhere" opportunities? bool that disables zip?
        fields: [
            {
                name: "type",
                required: true,
                hasMany: true,
                type: "select",
                options: [
                    "In-person",
                    "Hybrid",
                    "Remote",
                    "Lifestyle",
                ],
            },
            {
                name: "anywhere",
                type: "checkbox",
                admin: {
                    condition: (data, sibilingData) => {
                        return sibilingData.type.some( (el) => ["In-person", "Hybrid"].includes(el) )
                    },
                },
            },
            {
                name: "zipCode",
                type: "number",
                admin: {
                    condition: (data, sibilingData) => {
                        return sibilingData.type.some( (el) => ["In-person", "Hybrid"].includes(el) && !sibilingData.anywhere )
                    },
                },
            },
        ],
    },
    {
        name: "schedule",
        type: "group",
        admin: {
            condition: (data) => {
                return data.location.type !== "Lifestyle"
            },
        },
        fields: [
            {
                name: "type",
                required: true,
                type: "radio",
                options: [
                    "Weekly",
                    "Specific Date(s)",
                    "Any Time",
                ],
            },
            {
                name: "availability",
                type: "json",
                admin: { 
                    components: {
                        Field: '/components/AvailabilitySelector',
                    },
                },
                hooks: {
                    // before saving to db
                    beforeValidate: [
                      ({ value }) => {
                        // value should already be flattened, but in case something goes wrong on the client, we do it again here.
                        const flattened = value.flat()

                        if (flattened.length == 0) {
                          return flattened
                        }

                        // convert to unix timestamps
                        for (let block of flattened) {
                          block.start = getUnixTime(block.start)
                          block.end = getUnixTime(block.end)
                        }
                        
                        // deal with ends
                        let LOWER_BOUND = 882000
                        let UPPER_BOUND = 1486800
                        const ONE_WEEK = 604800
                        
                        LOWER_BOUND += 43200
                        UPPER_BOUND += 43200

                        const bounded = []
                        for (let block of flattened) {
                          // we will assume that block cannot span both the lower and upper bounds because there's no way to create one that long
                          if (block.start >= LOWER_BOUND && block.end <= UPPER_BOUND) {
                            // block is in bounds
                            bounded.push(block)
                          } else if (block.start < LOWER_BOUND && block.end <= LOWER_BOUND) {
                            // block is before bounds
                            console.log('before bounds')
                            block.start += ONE_WEEK
                            block.end += ONE_WEEK
                            bounded.push(block)
                          } else if (block.start >= UPPER_BOUND && block.end > UPPER_BOUND) {
                            // block is after bounds
                            console.log('after bounds')
                            block.start -= ONE_WEEK
                            block.end -= ONE_WEEK
                            bounded.push(block)
                          } else if (block.start < LOWER_BOUND && block.end > LOWER_BOUND) {
                            // block spans lower bounds
                            console.log('spans lower')
                            newBlock = {'start': (block.start + ONE_WEEK), 'end': UPPER_BOUND}
                            block.start = LOWER_BOUND
                            bounded.push(block, newBlock)
                          } else if (block.start < UPPER_BOUND && block.end > UPPER_BOUND) {
                            // block spans upper bounds
                            console.log('spans upper')
                            newBlock = {'start': LOWER_BOUND, 'end': (block.end - ONE_WEEK)}
                            block.end = UPPER_BOUND
                            bounded.push(block, newBlock)
                          }
                        }

                        // sort
                        const sorted = bounded.sort((a, b) => a - b)

                        console.log(sorted)

                        // merge
                        const merged = [sorted[0]]
                        for (let i = 1; i < sorted.length; i++) {
                          const current = sorted[i]
                          const lastMerged = merged[merged.length-1]
                          if (current.start <= lastMerged.end) {
                            lastMerged.end = current.end
                          } else {
                            merged.push(current)
                          }
                        }

                        console.log(merged)

                        return merged
                      }
                    ], 
                    // when reading from the db to the admin panel
                    afterRead: [
                      ({ value }) => {
                        return value.map((block) => interval(
                          fromUnixTime(block.start),
                          fromUnixTime(block.end)
                        ))
                      }
                    ]
                }
            },
        ],
    },
    {
        name: "description",
        type: "richText",
    },
    {
        name: "firstStep",
        type: "richText",
    },
    {
        name: "skills",
        type: "select",
        hasMany: true,
        options: [
            "software developer",
            "manual labor",
            "carpentry",
            "food service",
        ],
    },
    {
        name: "tags",
        type: "select",
        hasMany: true,
        options: [
            "environment",
            "homelessness",
            "food security",
            "LGBTQ",
            "consumer action",
        ],
    },
    // Rest of your fields
  ],
  timestamps: true,
};
