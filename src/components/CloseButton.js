import { AiOutlineClose } from "react-icons/ai"
export function CloseButton({ onClick }) {
    return (
        <button
            style={{ backgroundColor: 'transparent', border: 'none', cursor:'pointer' }}
            onClick={onClick}
        >
            <AiOutlineClose color={'#d0d4d3'} />
        </button>
    );
}