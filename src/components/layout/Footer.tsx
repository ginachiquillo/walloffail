import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-serif text-lg font-semibold">TO FAIL / FAILED</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Documenting technical failures with research-grade rigor.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium">Platform</h4>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li><Link to="/catalog" className="hover:text-foreground">Browse Failures</Link></li>
              <li><Link to="/submit" className="hover:text-foreground">Submit a Failure</Link></li>
              <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium">Account</h4>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li><Link to="/auth" className="hover:text-foreground">Sign In</Link></li>
              <li><Link to="/auth?mode=signup" className="hover:text-foreground">Create Account</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} TO FAIL / FAILED. Failure is documented.</p>
        </div>
      </div>
    </footer>
  );
}
