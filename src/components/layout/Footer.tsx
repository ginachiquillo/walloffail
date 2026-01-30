import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/30 relative z-10">
      <div className="container py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-black">
              WALL OF <span className="text-primary">FAIL</span>
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Documenting technical failures with research-grade rigor.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold">Platform</h4>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li><Link to="/catalog" className="hover:text-primary transition-colors">Browse Failures</Link></li>
              <li><Link to="/submit" className="hover:text-primary transition-colors">Submit a Failure</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold">Account</h4>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li><Link to="/auth" className="hover:text-primary transition-colors">Sign In</Link></li>
              <li><Link to="/auth?mode=signup" className="hover:text-primary transition-colors">Create Account</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-border/50 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} WALL OF FAIL. Failure is documented.</p>
        </div>
      </div>
    </footer>
  );
}
