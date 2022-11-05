export const isNotEmpty = (value) => value.trim() !== "";
export const isPassword = (value) =>
  value.length >= 8 && value.match(/([Aa-zZ]|[0-9]|[!@#$%^&*()_+-])/g);

export const isEmail = (value) =>
  value.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g
  );
