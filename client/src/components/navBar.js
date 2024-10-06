
import './navBar.css';

function NavBar({ onNavigate, onSignOut, currentView}){

    
    return(
        <div className='myNav'>
            
            <div className='navigate-button'>
                <button className= {currentView === 'employees' ? 'active' : ''}
                onClick={() => onNavigate('employees')}>Employees</button>

                <button className= {currentView === 'registration' ? 'active' : ''}
                onClick={() => onNavigate('registration')}>Register</button>
            </div>

            <div className='logout-button'>
                <button onClick={onSignOut}>Logout</button>
            </div>
        </div>
    )
}

export default NavBar;
