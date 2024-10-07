import {cn} from "@/lib/utils"


export const Appendix = ({classNames, isOwn} : {classNames? : string, isOwn?: boolean}) => {
  return (
    <svg className={cn("svg-appendix", classNames)} width={9} height={17}>
      <g fill="#212121" fillRule="evenodd">
        <path
          d="M6 17H0V0c.193 2.84.876 5.767 2.05 8.782.904 2.325 2.446 4.485 4.625 6.48A1 1 0 016 17z"
          fill={isOwn ? "#212121" : "#766ac8"}
          filter="url(#composerAppendix)"
        />
        <path
          d="M6 17H0V0c.193 2.84.876 5.767 2.05 8.782.904 2.325 2.446 4.485 4.625 6.48A1 1 0 016 17z"
          fill={isOwn ? "#212121" : "#766ac8"}
          className="corner"
        />
      </g>
    </svg>
  );
};


