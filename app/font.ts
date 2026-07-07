import localFont from "next/font/local";

export const satoshi = localFont({
  src: [
    {
      path: "./fonts/Satoshi-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Satoshi-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Satoshi-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Satoshi-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
});
