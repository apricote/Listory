import React from "react";

export const TrashcanIcon: React.FC<React.SVGProps<SVGSVGElement>> = (
  props,
) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0"
      y="0"
      viewBox="0 0 60.167 60.167"
      fill="#fff"
      {...props}
    >
      <path
        fill="fill"
        d="M54.5 11.667H39.88V3.91A3.914 3.914 0 0035.97 0H24.196a3.914 3.914 0 00-3.91 3.91v7.756H5.667a1 1 0 000 2h2.042v40.5c0 3.309 2.691 6 6 6h32.75c3.309 0 6-2.691 6-6v-40.5H54.5a1 1 0 000-1.999zM22.286 3.91c0-1.053.857-1.91 1.91-1.91H35.97c1.053 0 1.91.857 1.91 1.91v7.756H22.286V3.91zm28.172 50.257c0 2.206-1.794 4-4 4h-32.75c-2.206 0-4-1.794-4-4v-40.5h40.75v40.5zm-12.203-8.014V22.847a1 1 0 012 0v23.306a1 1 0 01-2 0zm-9.172 0V22.847a1 1 0 012 0v23.306a1 1 0 01-2 0zm-9.172 0V22.847a1 1 0 012 0v23.306a1 1 0 01-2 0z"
      ></path>
    </svg>
  );
};

export default TrashcanIcon;
