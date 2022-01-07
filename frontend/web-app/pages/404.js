import React from "react";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="not-found-container">
            <div className="not-found-body">
                <h1 className="not-found-title"> This page is not found</h1>
                <Link href="/">
                    <a className="not-found-link">Main page</a>
                </Link>
            </div>
        </div>
    );
}
