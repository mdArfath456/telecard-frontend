import React from "react";

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error("TeleCard crashed:", error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="screen-loader" style={{ flexDirection: "column", gap: "1rem" }}>
                    <p>Something went wrong.</p>
                    <button onClick={() => window.location.assign("/")}>
                        Go back home
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}