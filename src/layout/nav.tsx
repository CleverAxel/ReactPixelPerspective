import { Link } from "react-router-dom";

export default function Nav(){
    return (
        <nav className="flex gap-1">
            <div>
                <Link to={"/upload"}>Upload</Link>
            </div>
            <div>
                <Link to={"/canvas"}>Canvas</Link>
            </div>
        </nav>
    )
}