import * as Yup from "yup";
const phoneRegExp = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
const jobValidationSchema = Yup.object().shape({
  organizationId: Yup.number()
    .integer()
    .required("This field is required"),
  jobTypeId: Yup.number().required("This field is required"),
  locationId: Yup.number().required("This field is required"),
  title: Yup.string()
    .min(3, "Too short!")
    .max(201, "Too Long!")
    .required("This field is required"),
  description: Yup.string()
    .min(3, "Too short!")
    .max(4001, "Too long!")
    .required("This field is required"),
  requirements: Yup.string()
    .min(3, "Too short!")
    .max(3000, "Too long!")
    .required("This field is required"),
  isActive: Yup.boolean(),
  contactName: Yup.string()
    .min(3, "Too short!")
    .max(100, "Too long!")
    .required("This field is required"),
  contactPhone: Yup.string().matches(phoneRegExp, "Phone number must be valid"),
  contactEmail: Yup.string()
    .matches(
      /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})/,
      "Must input a valid email"
    )
    .nullable()
});

export { jobValidationSchema };
