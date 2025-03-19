import { CollectionConfig } from "payload";

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
        fields: [
            {
                name: "type",
                required: true,
                type: "radio",
                options: [
                    "In-person",
                    "Hybrid",
                    "Remote",
                    "Lifestyle",
                ],
            },
            {
                name: "zipCode",
                type: "number",
                required: true,
                admin: {
                    condition: (data, sibilingData) => {
                        return ["In-person", "Hybrid"].includes(sibilingData.type)
                    },
                },
            },
        ],
    },
    {
        name: "schedule",
        type: "group",
        fields: [
            {
                name: "type",
                required: true,
                type: "radio",
                options: [
                    "One-time",
                    "Recurring",
                ],
            },
            {
                name: "flexible",
                type: "checkbox",
            },
            // need additional options here for weekdays, specific dates, etc
        ],
    },
    {
        type: "row",
        fields: [
            {
                name: "minHours",
                label: "Minimum hours per week",
                type: "number",
                min: "0",
                max: "168",
            },
            {
                name: "maxHours",
                label: "Maximum hours per week",
                type: "number",
                min: "0",
                max: "168",
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
