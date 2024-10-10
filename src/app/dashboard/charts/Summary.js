import {
    Card,
    Text,
} from "@tremor/react";
import { useSelector } from "react-redux";

const Summary = () => {
    const {
        analyzeSummary,
    } = useSelector(state => state.user);

    return (
        <Card>
            <pre className="max-w-full overflow-x-auto font-sans whitespace-pre-wrap">
                <Text>{analyzeSummary}</Text>
            </pre>
            <br />
            {analyzeSummary?.length < 50 ? ( // replace with better way to tell when response is ready to stream. Show below svg while we wait. Loading from public causes issues in deployment use svg directly.
                <svg
                    width="38"
                    height="38"
                    viewBox="0 0 38 38"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="#666"
                >
                    <g fill="none" fillRule="evenodd">
                        <g transform="translate(1 1)" strokeWidth="2">
                            <circle strokeOpacity=".5" cx="18" cy="18" r="18" />
                            <path d="M36 18c0-9.94-8.06-18-18-18">
                                <animateTransform
                                    attributeName="transform"
                                    type="rotate"
                                    from="0 18 18"
                                    to="360 18 18"
                                    dur="1s"
                                    repeatCount="indefinite"
                                />
                            </path>
                        </g>
                    </g>
                </svg>
            ) : null}
        </Card>
    )
}

export default Summary
