import { Link } from "react-router-dom";

const NotFound = () => {
return (
<div className="min-h-screen flex items-center justify-center text-center px-4">
<div>
<h1 className="text-6xl font-black text-primary mb-4">404</h1>
<p className="text-xl text-muted-foreground mb-6">Page not found</p>
<Link to="/" className="text-primary hover:underline">
Back to Dashboard
</Link>
</div>
</div>
);
};

export default NotFound;
