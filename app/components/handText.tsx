import { useEffect } from "react";
import Vara from "vara";
import React from "react";
function VaraText({ text }: { text: string }) {
  useEffect(() => {
    var vara = new Vara(
      "#vara-container",
      "https://raw.githubusercontent.com/akzhy/Vara/master/fonts/Satisfy/SatisfySL.json",
      [
        {
          text: text,
          fontSize: 40,
          strokeWidth: 0.7,
        },
      ]
    );
  }, []);

  return <div id="vara-container" className="z-[20]"></div>;
}
