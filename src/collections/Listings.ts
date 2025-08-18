import { CollectionConfig } from "payload"
import { getUnixTime, fromUnixTime, interval, areIntervalsOverlapping } from "date-fns"

export const Listings: CollectionConfig = {
  slug: "listings",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "organization", "isRemote", "updatedAt"],
    group: "Content",
  },
  versions: {drafts: true},
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
      name: "organization",
      type: "relationship",
      relationTo: "organizations",
      required: false,
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
                        return sibilingData.type?.some( (el) => ["In-person", "Hybrid"].includes(el) ) ?? false
                    },
                },
            },
            {
                name: "zipCode",
                type: "number",
                admin: {
                    condition: (data, sibilingData) => {
                        return sibilingData.type?.some( (el) => ["In-person", "Hybrid"].includes(el) && !sibilingData.anywhere ) ?? false
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
                    condition: (data, sibilingData) => {
                        return sibilingData.type === "Weekly"
                    },
                },
                defaultValue: {
                  'timeBlocks': [],
                  'timeZone': null
                },
                hooks: {
                  afterRead: [
                    // convert old format availabilities 
                    ({ value }) => {
                      if (Array.isArray(value)) {
                        return {
                          'timeBlocks': [],
                          'timeZone': null
                        }
                      } else {
                        return value
                      }
                    }
                  ]
                }
            },
            {
              name: "dates",
              type: "array",
              validate: (value) => {
                console.log(value)
                if (value.start >= value.end) {
                  return "Start time must be before end time."
                }
              },
              fields: [
                {
                  name: "start",
                  type: "date",
                  admin: {
                    date: {
                      pickerAppearance: "dayAndTime",
                      timeIntervals: 15
                    },
                  },
                },
                {
                  name: "end",
                  type: "date",
                  admin: {
                    date: {
                      pickerAppearance: "dayAndTime",
                      timeIntervals: 15
                    },
                  },
                },
              ],
            }
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
