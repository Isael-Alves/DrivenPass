import { ApplicationError } from "@/protocols";

export function unprocessableEntity(): ApplicationError {
  return {
    name: "UnprocessableEntity",
    message: "Enprocessable Entity!",
  };
}
