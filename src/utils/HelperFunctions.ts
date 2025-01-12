// handle the color of the status tag or any tag
export const statusColorTag = (status: string) => {
  switch (status) {
    case "Delivered":
      return "success";
      break;
    case "Processing":
      return "processing";
      break;
    case "Dispatched":
      return "warning";
      break;
    case "Cancelled":
      return "error";
      break;

    default:
      return "default";
      break;
  }
};
