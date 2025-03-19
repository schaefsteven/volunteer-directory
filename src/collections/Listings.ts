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
                label: "",
                type: "array",
                minRows: 1,
                labels: {
                    singular: "Time Block",
                    plural: "Time Blocks",
                },
                fields: [
                    {
                        type: "number",
                        name: "start",
                        min: 0,
                        max: 169,
                    },
                    {
                        type: "number",
                        name: "end",
                        min: 0,
                        max: 169,
                    },
                ],
                admin: {
                    condition: (data, sibilingData) => {
                        return sibilingData.type === "Weekly"
                    },
                },
            },
            {
                name: "minTimeBlock",
                label: "Minimum Time Block",
                type: "number",
                max: 168,
                admin: {
                    condition: (data, sibilingData) => {
                        return sibilingData.type === "Weekly"
                    },
                },
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
