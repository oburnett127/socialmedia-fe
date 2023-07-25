import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { UserContext } from './UserContext';

function MainNavigation() {
  const { isLoggedIn } = useContext(UserContext);

  const { user } = useContext(UserContext);

  return (
    <header>
      <nav>
        <ul>
          <li>
            <NavLink
              to="/friends"
              end
            >
              Friends
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/requests"
            >
              Search / Requests
            </NavLink>
          </li>
          {user && user.id && (
          <li>
            <NavLink
              to={{ pathname: `/currentuserprofile` }}
            >
              My Page
            </NavLink>
          </li>
          )}
          {!isLoggedIn && (
              <li>
                <NavLink
                  to="/auth"
                >
                  Login / Signup
                </NavLink>
              </li>
            )
          }
          {isLoggedIn && (
              <li>
                <NavLink
                  to="/logout"
                >
                  Logout
                </NavLink>
              </li>             
            )
          }
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
