import { forwardRef, ReactElement, ReactNode, SVGProps } from "react";

export interface SvgIconProps extends SVGProps<SVGSVGElement> {
    children?: ReactNode;
    viewBox?: string;
}

const SvgIcon = forwardRef<SVGSVGElement, SvgIconProps>(function SvgIcon(
    props,
    ref
) {
    const {
        children,
        viewBox = "0 0 16 16",
        width = 16,
        height = 16,
        ...otherProps
    } = props;

    return (
        <svg
            ref={ref}
            viewBox={viewBox}
            width={width}
            height={height}
            {...otherProps}
        >
            {children}
        </svg>
    );
});

const createIconWithViewBox = (viewBox: string) => (icon: ReactNode) =>
    forwardRef<SVGSVGElement>(function IconWithViewBox(
        props: SvgIconProps,
        ref
    ) {
        return (
            <SvgIcon {...props} viewBox={viewBox} ref={ref}>
                {icon}
            </SvgIcon>
        );
    }) as (props: SvgIconProps) => ReactElement;

const createIcon = (size: number | string) =>
    createIconWithViewBox(`0 0 ${size} ${size}`);

export const ProgressIcon = createIcon(32)(
    <>
        <path
            d="M17.4378 30.9492C17.4378 31.8057 16.794 32.5 15.9999 32.5C15.2058 32.5 14.562 31.8057 14.562 30.9492V26.6661C14.562 25.8097 15.2058 25.1154 15.9999 25.1154C16.794 25.1154 17.4378 25.8097 17.4378 26.6661V30.9492Z"
            fill="currentColor"
            fillOpacity="0.5"
        />
        <path
            d="M25.8454 27.3629C26.36 28.0558 26.2564 28.9877 25.6139 29.4443C24.9715 29.9009 24.0335 29.7094 23.5188 29.0165L20.9453 25.5514C20.4307 24.8585 20.5343 23.9266 21.1768 23.47C21.8192 23.0134 22.7572 23.2049 23.2719 23.8978L25.8454 27.3629Z"
            fill="currentColor"
            fillOpacity="0.6"
        />
        <path
            d="M30.4922 19.6273C31.3248 19.8919 31.8009 20.7054 31.5555 21.4442C31.3101 22.1831 30.4362 22.5674 29.6035 22.3028L25.4394 20.9792C24.6067 20.7146 24.1306 19.9011 24.376 19.1623C24.6214 18.4234 25.4954 18.0391 26.328 18.3037L30.4922 19.6273Z"
            fill="currentColor"
            fillOpacity="0.7"
        />
        <path
            d="M29.6036 10.6972C30.4363 10.4325 31.3103 10.8169 31.5557 11.5557C31.8011 12.2945 31.325 13.108 30.4923 13.3727L26.3282 14.6962C25.4955 14.9609 24.6215 14.5765 24.3761 13.8377C24.1307 13.0989 24.6068 12.2854 25.4395 12.0207L29.6036 10.6972Z"
            fill="currentColor"
            fillOpacity="0.8"
        />
        <path
            d="M23.5189 3.98348C24.0335 3.29059 24.9715 3.09904 25.614 3.55566C26.2564 4.01228 26.3601 4.94414 25.8454 5.63704L23.2719 9.10213C22.7573 9.79503 21.8192 9.98657 21.1768 9.52996C20.5343 9.07334 20.4307 8.14147 20.9453 7.44858L23.5189 3.98348Z"
            fill="currentColor"
            fillOpacity="0.9"
        />
        <path
            d="M14.5622 2.05077C14.5622 1.1943 15.206 0.5 16.0001 0.5C16.7942 0.5 17.438 1.1943 17.438 2.05077V6.33386C17.438 7.19033 16.7942 7.88463 16.0001 7.88463C15.206 7.88463 14.5622 7.19033 14.5622 6.33386V2.05077Z"
            fill="currentColor"
        />
        <path
            d="M6.15458 5.63709C5.63996 4.94419 5.74359 4.01232 6.38606 3.55571C7.02853 3.09909 7.96653 3.29063 8.48116 3.98353L11.0547 7.44862C11.5693 8.14152 11.4657 9.07339 10.8232 9.53C10.1808 9.98662 9.24277 9.79507 8.72815 9.10218L6.15458 5.63709Z"
            fill="currentColor"
            fillOpacity="0.1"
        />
        <path
            d="M1.50783 13.3727C0.675156 13.1081 0.199073 12.2946 0.444473 11.5558C0.689873 10.8169 1.56383 10.4326 2.39651 10.6972L6.56063 12.0208C7.3933 12.2854 7.86939 13.0989 7.62399 13.8377C7.37859 14.5766 6.50463 14.9609 5.67195 14.6963L1.50783 13.3727Z"
            fill="currentColor"
            fillOpacity="0.2"
        />
        <path
            d="M2.39637 22.3028C1.56369 22.5675 0.689736 22.1831 0.444336 21.4443C0.198936 20.7055 0.675019 19.892 1.5077 19.6273L5.67182 18.3038C6.50449 18.0391 7.37845 18.4235 7.62385 19.1623C7.86925 19.9011 7.39317 20.7146 6.56049 20.9793L2.39637 22.3028Z"
            fill="currentColor"
            fillOpacity="0.3"
        />
        <path
            d="M8.48113 29.0165C7.96651 29.7094 7.0285 29.901 6.38604 29.4443C5.74357 28.9877 5.63993 28.0559 6.15456 27.363L8.72812 23.8979C9.24275 23.205 10.1808 23.0134 10.8232 23.47C11.4657 23.9267 11.5693 24.8585 11.0547 25.5514L8.48113 29.0165Z"
            fill="currentColor"
            fillOpacity="0.4"
        />
    </>
);

export const CheckIcon = createIcon(16)(
    <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.8494 3.15816C14.0502 3.36905 14.0502 3.71095 13.8494 3.92184L6.30651 11.8418C6.10567 12.0527 5.78004 12.0527 5.5792 11.8418L2.15063 8.24184C1.94979 8.03095 1.94979 7.68905 2.15063 7.47816C2.35147 7.26728 2.6771 7.26728 2.87794 7.47816L5.94286 10.6963L13.1221 3.15816C13.3229 2.94728 13.6485 2.94728 13.8494 3.15816Z"
        fill="currentColor"
    />
);

export const FilterArrowDownIcon = createIcon(16)(
    <>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8 2.83334C8.27615 2.83334 8.5 3.0572 8.5 3.33334V12.6667C8.5 12.9428 8.27615 13.1667 8 13.1667C7.72386 13.1667 7.5 12.9428 7.5 12.6667V3.33334C7.5 3.0572 7.72386 2.83334 8 2.83334Z"
            fill="currentColor"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2.97978 7.64646C3.17504 7.45119 3.49163 7.45119 3.68689 7.64646L8 11.9596L12.3131 7.64646C12.5084 7.45119 12.825 7.45119 13.0202 7.64646C13.2155 7.84172 13.2155 8.1583 13.0202 8.35356L8.35356 13.0202C8.15829 13.2155 7.84171 13.2155 7.64645 13.0202L2.97978 8.35356C2.78452 8.1583 2.78452 7.84172 2.97978 7.64646Z"
            fill="currentColor"
        />
    </>
);

export const FilterArrowUpIcon = createIcon(16)(
    <>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8 13.1667C8.27614 13.1667 8.5 12.9428 8.5 12.6667V3.33336C8.5 3.05722 8.27614 2.83336 8 2.83336C7.72386 2.83336 7.5 3.05722 7.5 3.33336V12.6667C7.5 12.9428 7.72386 13.1667 8 13.1667Z"
            fill="currentColor"
        />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2.97945 8.3535C3.17472 8.54876 3.4913 8.54876 3.68656 8.3535L7.99967 4.04039L12.3128 8.3535C12.508 8.54876 12.8246 8.54876 13.0199 8.3535C13.2152 8.15824 13.2152 7.84166 13.0199 7.6464L8.35323 2.97973C8.15797 2.78447 7.84138 2.78447 7.64612 2.97973L2.97945 7.6464C2.78419 7.84166 2.78419 8.15824 2.97945 8.3535Z"
            fill="currentColor"
        />
    </>
);

export const FilterTableIcon = createIcon(24)(
    <>
        <path
            d="M4 7H20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
        />
        <path
            d="M7 12L17 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
        />
        <path
            d="M11 17H13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
        />
    </>
);

export const SearchIcon = createIcon(24)(
    <>
        <circle
            cx="11.5"
            cy="11.5"
            r="9.5"
            stroke="currentColor"
            fill="none"
            strokeWidth="1.5"
        />
        <path
            d="M18.5 18.5L22 22"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
        />
    </>
);

export const CloseIcon = createIcon(24)(
    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="Close">
            <line
                x1="16.9999"
                y1="7"
                x2="7.00001"
                y2="16.9999"
                id="Path"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <line
                x1="7.00006"
                y1="7"
                x2="17"
                y2="16.9999"
                id="Path"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </g>
    </g>
);

export const SuccessIcon = createIcon(24)(
    <>
        <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
        />
        <path
            d="M8.5 12.5L10.5 14.5L15.5 9.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </>
);

export const WarningIcon = createIcon(24)(
    <>
        <path
            d="M5.31171 10.7615C8.23007 5.58716 9.68925 3 12 3C14.3107 3 15.7699 5.58716 18.6883 10.7615L19.0519 11.4063C21.4771 15.7061 22.6897 17.856 21.5937 19.428C20.4978 21 17.7864 21 12.3637 21H11.6363C6.21356 21 3.50217 21 2.40626 19.428C1.31034 17.856 2.52291 15.7061 4.94805 11.4063L5.31171 10.7615Z"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
        />
        <path
            d="M12 8V13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
        />
        <circle cx="12" cy="16" r="1" fill="currentColor" />
    </>
);

export const ErrorIcon = createIcon(24)(
    <>
        <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
        />
        <path
            d="M12 7V13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
        />
        <circle cx="12" cy="16" r="1" fill="currentColor" />
    </>
);

export const EmptyIcon = createIcon(16)(<></>);

export const InfoIcon = createIcon(24)(
    <>
        <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
        />
        <path
            d="M12 17V11"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
        />
        <circle
            cx="1"
            cy="1"
            r="1"
            transform="matrix(1 0 0 -1 11 9)"
            fill="currentColor"
        />
    </>
);

export const OpenWindowIcon = createIcon(24)(
    <path
        fill="currentColor"
        d="M19,2 C20.5976809,2 21.9036609,3.24891996 21.9949073,4.82372721 L22,5 L22,15 C22,16.5976809 20.75108,17.9036609 19.1762728,17.9949073 L19,18 L15,18 L15,16 L19,16 C19.5128358,16 19.9355072,15.6139598 19.9932723,15.1166211 L20,15 L20,6 L4,6 L4,15 C4,15.5128358 4.38604019,15.9355072 4.88337887,15.9932723 L5,16 L9,16 L9,18 L5,18 C3.40231912,18 2.09633912,16.75108 2.00509269,15.1762728 L2,15 L2,5 C2,3.40231912 3.24891996,2.09633912 4.82372721,2.00509269 L5,2 L19,2 Z M12.082,8.003 L12.079,8.002 L12.2335141,8.02742266 L12.2335141,8.02742266 L12.3416665,8.05989459 L12.3416665,8.05989459 L12.4232215,8.09367336 L12.5207088,8.14599545 L12.5207088,8.14599545 L12.5951593,8.19631351 L12.5951593,8.19631351 L12.7071068,8.29289322 L16.7071068,12.2928932 C17.0976311,12.6834175 17.0976311,13.3165825 16.7071068,13.7071068 C16.3466228,14.0675907 15.7793918,14.0953203 15.3871006,13.7902954 L15.2928932,13.7071068 L13,11.414 L13,21 C13,21.5522847 12.5522847,22 12,22 C11.4477153,22 11,21.5522847 11,21 L11,11.416 L8.70710678,13.7071068 C8.34662282,14.0675907 7.77939176,14.0953203 7.38710056,13.7902954 L7.29289322,13.7071068 C6.93240926,13.3466228 6.90467972,12.7793918 7.20970461,12.3871006 L7.29289322,12.2928932 L11.2928932,8.29289322 L11.336853,8.2514958 L11.336853,8.2514958 L11.4046934,8.19633458 L11.4046934,8.19633458 L11.5159379,8.12467117 L11.5769009,8.09365378 L11.5769009,8.09365378 L11.6583496,8.05988586 L11.6583496,8.05988586 L11.734007,8.03584514 L11.734007,8.03584514 L11.8825258,8.00683422 L11.8825258,8.00683422 L11.9667532,8.00054939 L11.9667532,8.00054939 L12.082,8.003 Z"
    />
);

export const CopyIcon = createIcon(24)(
    <>
        <path
            d="M6 11C6 8.17157 6 6.75736 6.87868 5.87868C7.75736 5 9.17157 5 12 5H15C17.8284 5 19.2426 5 20.1213 5.87868C21 6.75736 21 8.17157 21 11V16C21 18.8284 21 20.2426 20.1213 21.1213C19.2426 22 17.8284 22 15 22H12C9.17157 22 7.75736 22 6.87868 21.1213C6 20.2426 6 18.8284 6 16V11Z"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
        />
        <path
            d="M6 19C4.34315 19 3 17.6569 3 16V10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H15C16.6569 2 18 3.34315 18 5"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
        />
    </>
);

export const DeleteIcon = createIcon(24)(
    <>
        <path
            d="M20.5001 6H3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
        />
        <path
            d="M18.8332 8.5L18.3732 15.3991C18.1962 18.054 18.1077 19.3815 17.2427 20.1907C16.3777 21 15.0473 21 12.3865 21H11.6132C8.95235 21 7.62195 21 6.75694 20.1907C5.89194 19.3815 5.80344 18.054 5.62644 15.3991L5.1665 8.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
        />
        <path
            d="M9.1709 4C9.58273 2.83481 10.694 2 12.0002 2C13.3064 2 14.4177 2.83481 14.8295 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
        />
    </>
);

export const PasteIcon = createIcon(24)(
    <path
        d="M13.7778 5H14.6667C15.5047 5 15.9237 5 16.1841 5.2636C16.4444 5.52721 16.4444 5.95147 16.4444 6.8V10M13.7778 5V5.8C13.7778 6.22426 13.7778 6.4364 13.6476 6.5682C13.5174 6.7 13.3079 6.7 12.8889 6.7H7.55556C7.13653 6.7 6.92702 6.7 6.79684 6.5682C6.66667 6.4364 6.66667 6.22426 6.66667 5.8V5M13.7778 5C13.7778 4.57574 13.7778 4.2636 13.6476 4.1318C13.5174 4 13.3079 4 12.8889 4H7.55556C7.13653 4 6.92702 4 6.79684 4.1318C6.66667 4.2636 6.66667 4.57574 6.66667 5M6.66667 5H5.77778C4.93973 5 4.5207 5 4.26035 5.2636C4 5.52721 4 5.95147 4 6.8V17.1959C4 18.0445 4 18.4687 4.26035 18.7323C4.5207 18.9959 4.93973 18.9959 5.77778 18.9959H9.77778M14 20H18C18.9428 20 19.4142 20 19.7071 19.7071C20 19.4142 20 18.9428 20 18V14C20 13.0572 20 12.5858 19.7071 12.2929C19.4142 12 18.9428 12 18 12H14C13.0572 12 12.5858 12 12.2929 12.2929C12 12.5858 12 13.0572 12 14V18C12 18.9428 12 19.4142 12.2929 19.7071C12.5858 20 13.0572 20 14 20Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
    />
);

export const PlusIcon = createIcon(24)(
    <path
        d="M6 12H18M12 6V18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    />
);

export const CheckedIcon = createIcon(16)(
    <>
        <rect width="16" height="16" rx="4" fill="none" stroke="currentColor" />
        <path
            d="M3.75 7.75L6.75 10.75L12.25 5.25"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
        />
    </>
);

export const UncheckedIcon = createIcon(16)(
    <rect width="16" height="16" rx="4" fill="none" stroke="currentColor" />
);

export const IndeterminateIcon = createIcon(16)(
    <>
        <rect width="16" height="16" rx="4" fill="none" stroke="currentColor" />
        <line
            x1="5"
            y1="8"
            x2="11"
            y2="8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
        />
    </>
);

export const RadioCheckedIcon = createIcon(16)(
    <>
        <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" />
        <circle cx="8" cy="8" r="3" fill="currentColor" />
    </>
);

export const RadioUncheckedIcon = createIcon(16)(
    <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" />
);

export const ChevronUpIcon = createIcon(16)(
    <>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.8373 10.8243C12.6203 11.0586 12.2686 11.0586 12.0516 10.8243L8 6.44853L3.94839 10.8243C3.73143 11.0586 3.37968 11.0586 3.16272 10.8243C2.94576 10.59 2.94576 10.2101 3.16272 9.97574L7.60716 5.17574C7.82412 4.94142 8.17588 4.94142 8.39284 5.17574L12.8373 9.97574C13.0542 10.2101 13.0542 10.59 12.8373 10.8243Z"
            fill="currentColor"
        />
    </>
);

export const ChevronDownIcon = createIcon(16)(
    <>
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3.16272 5.17574C3.37968 4.94142 3.73143 4.94142 3.94839 5.17574L8 9.55147L12.0516 5.17574C12.2686 4.94142 12.6203 4.94142 12.8373 5.17574C13.0542 5.41005 13.0542 5.78995 12.8373 6.02426L8.39284 10.8243C8.17588 11.0586 7.82412 11.0586 7.60716 10.8243L3.16272 6.02426C2.94576 5.78995 2.94576 5.41005 3.16272 5.17574Z"
            fill="currentColor"
        />
    </>
);

export const ResizeHandleIcon = createIcon(24)(
    <path
        d="M21 15L15 21M21 8L8 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    />
);

export const ARightIcon = createIcon(24)(
    <path
        d="M5 3 L20 12 L5 21 L5 3"
        stroke="#00BFC8"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
    />
);

export const StopIcon = createIcon(24)(
    <rect
        x="4"
        y="4"
        width="16"
        height="16"
        fill="none"
        stroke="#ce9178"
        strokeWidth="1"
    />
);

export const ClearConsoleIcon = createIcon(16)(
    <path
        d="M10 12.6l.7.7 1.6-1.6 1.6 1.6.8-.7L13 11l1.7-1.6-.8-.8-1.6 1.7-1.6-1.7-.7.8 1.6 1.6-1.6 1.6zM1 4h14V3H1v1zm0 3h14V6H1v1zm8 2.5V9H1v1h8v-.5zM9 13v-1H1v1h8z"
        fill="currentColor"
    />
);

export const FileSearchIcon = createIcon(24)(
    <g
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M4 22h14a2 2 0 002-2V7.5L14.5 2H6a2 2 0 00-2 2v3" />
        <path d="M14 2v6h6" />
        <path d="M5 17a3 3 0 100-6 3 3 0 000 6z" />
        <path d="M9 18l-1.5-1.5" />
    </g>
);

export const FolderOpenIcon = createIcon(24)(
    <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 17l2-5h14l-3 8a2 2 0 01-2 1H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h7a2 2 0 012 2v4"
    />
);
