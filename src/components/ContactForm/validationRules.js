export default function validate(values) {
  let errors = {};
  if (!values.startDate || !values.endDate) {
    errors.listing = "Date is required";
  }
  if (!values.size) {
    errors.size = "Listing Size is required";
  }
  if (!values.description) {
    errors.description = "Listing Description is required";
  }
  return errors;
}
