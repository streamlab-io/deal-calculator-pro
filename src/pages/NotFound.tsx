
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold tracking-tighter">404</h1>
          <p className="text-2xl font-medium">Page not found</p>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-full text-sm font-medium transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
