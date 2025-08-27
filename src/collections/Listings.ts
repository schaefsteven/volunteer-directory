import { CollectionConfig } from "payload"
import { getUnixTime, fromUnixTime, interval, areIntervalsOverlapping } from "date-fns"
import { TIMEZONE_LIST } from "../constants"

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
      admin: {
        description: 'This shoud not be the name of the Organization. Instead, the title should be like a "job title" such as "Childcare Provider", "Software Engineer", or "Volunteer". If that doesn\'t fit, it should describe what you will do such as "Switch to a Climate-Friendly Bank", or "Cook Meals for Families in Need."',
      },
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
              const arr = data.location.type
              if (arr) {
                return !(arr.length === 1 && arr[0] === "Lifestyle")
              } else {
                return true
              }
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
              name: "minTimeBlock",
              type: "number",
              required: true,
              admin: {
                components: {
                  Field: '/components/DurationSelector',
                },
                description: "This is the minimum amount of time that someone can volunteer for",
              },
            },
            {
              name: "timezone",
              type: "select",
              options: TIMEZONE_LIST,
              admin: {
                components: {
                  Field: '/components/TimezoneSelector',
                },
              },
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
                defaultValue: [],
                hooks: {
                }
            },
            {
              name: "dates",
              type: "array",
              admin: {
                condition: (data) => {
                  return data.schedule.type === "Specific Date(s)"
                }
              },
              fields: [
                {
                  type: 'row',
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
                      validate: (value, { siblingData }) => {
                        if (siblingData.start >= siblingData.end) {
                          return "Start time must be before end time."
                        } else {
                          return true
                        }
                      }
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
                },
              ],
            }
        ],
    },
    {
        name: "role",
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
