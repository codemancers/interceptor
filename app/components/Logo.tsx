import * as React from "react";

export const Logo: React.SFC<{}> = () => (
  <a className="logo" href="#">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Interceptor"
      role="Image"
      viewBox="0 0 32 32"
      width="16"
      height="16"
    >
      <rect fill="#3A539B" width="32" height="32" x="0" y="0" />
      <path
        fill="#ffffff"
        d="M 1,1 1,31 13.875,18.125 4.84375,9.09375 l 4.25,-4.25 L 18.125,13.875 31,1 1,1 z"
      />
      <path
        fill="#ffffff"
        d="m 18.125,13.875 -4.25,4.25 9.03125,9.03125 4.25,-4.25 L 18.125,13.875 z"
      />
      <path fill="#ffffff" d="m 31,1 1,-1 0,32 -32,0 1,-1 30,0" />
      <path fill="#ffffff" d="m 31,1 1,-1 0,32 -32,0 1,-1 30,0" />
    </svg>
    <span>INTERCEPTOR</span>
  </a>
);

Logo.displayName = "Logo";
