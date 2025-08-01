import { CollectionConfig } from "payload"
import { getUnixTime, fromUnixTime, getDay, interval } from "date-fns"

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
                        value = value.flat()
                        for (let block of value) {
                          block.start = getUnixTime(block.start)
                          block.end = getUnixTime(block.end)
                        }
                        return value.sort((a, b) => a.start - b.start)
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
