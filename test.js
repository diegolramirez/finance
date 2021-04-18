"use strict";

try {
  throw new Error("Forbidden");
} catch (err) {
  if (err.message === "Forbidden") console.log("hola");
  console.log(err.message);
}
