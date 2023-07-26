import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { UserContext } from './UserContext';
import classes from './MainNavigation.module.css';

function MainNavigation() {
  const { isLoggedIn } = useContext(UserContext);

  const { user } = useContext(UserContext);

  return (
    <header>
      <nav>
        <ul className={classes.unorderedlist}>
          <li className={classes.listitem}>
            <NavLink className={classes.lia}
              to="/friends"
              end
            >
              Friends
            </NavLink>
          </li>
          <li className={classes.listitem}>
            <NavLink className={classes.lia}
              to="/requests"
            >
              Search / Requests
            </NavLink>
          </li>
          {user && user.id && (
          <li className={classes.listitem}>
            <NavLink className={classes.lia}
              to={{ pathname: `/currentuserprofile` }}
            >
              My Page
            </NavLink>
          </li>
          )}
          {!isLoggedIn && (
              <li className={classes.listitem}>
                <NavLink className={classes.lia}
                  to="/auth"
                >
                  Login / Signup
                </NavLink>
              </li>
            )
          }
          {isLoggedIn && (
              <li className={classes.listitem}>
                <NavLink className={classes.lia}
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
