import { useRef, useState, useEffect } from 'react';
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from './api/axios';

const USER_REGEX = /^[A-z][A-z0-9-_]{2,23}$/;
const ROLE_REGEX = /^[A-z][A-z]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REDEX = /^[\w\d-]+(?:\.[\w\d-]+)*@[\w\d]+\.[\w]{1,10}$/;

const REGISTER_URL = '/api/v1/register';

const Register = () => {
  const fNameRef = useRef();
  const errRef = useRef();

  const [firstName, setFirstName] = useState('');
  const [validFirstName, setValidFirstName] = useState(false);
  const [firstNameFocus, setFirstNameFocus] = useState(false);

  const [lastName, setLastName] = useState('');
  const [validLastName, setValidLastName] = useState(false);
  const [lastNameFocus, setLastNameFocus] = useState(false);

  // setting email , validate email, set focus
  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatchPwd, setMatchValidPwd] = useState(false);
  const [matchPwdFocus, setMatchPwdFocus] = useState(false);

  const [role, setRole] = useState('');
  const [validRole, setValidRole] = useState(false);
  const [roleFocus, setRoleFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fNameRef.current.focus();
  }, []);

  useEffect(() => {
    const result = USER_REGEX.test(firstName);
    console.log('TEST FN : ' + result);
    console.log('FN : ' + firstName);
    setValidFirstName(result);
  }, [firstName]);

  useEffect(() => {
    const result = USER_REGEX.test(lastName);
    console.log('TEST LN : ' + result);
    console.log('LN : ' + lastName);
    setValidLastName(result);
  }, [lastName]);

  useEffect(() => {
    const result = EMAIL_REDEX.test(email);
    console.log('test email ' + result);
    console.log('email ' + email);
    setValidEmail(result);
  }, [email]);

  useEffect(() => {
    const result = PWD_REGEX.test(pwd);
    console.log('pwd ' + result);
    console.log('pwd' + pwd);
    setValidPwd(result);

    setMatchValidPwd(pwd && matchPwd && pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    const result = ROLE_REGEX.test(role);
    console.log(result);
    console.log(role);
    setValidRole(result);
  }, [role]);

  useEffect(() => {
    setErrMsg('');
  }, [firstName, lastName, email, pwd, matchPwd, role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if button enabled with JS hack
    const v1 = USER_REGEX.test(firstName);
    const v2 = PWD_REGEX.test(pwd);
    const v3 = ROLE_REGEX.test(role);
    const v4 = PWD_REGEX.test(matchPwd);
    const v5 = USER_REGEX.test(lastName);
    const v6 = EMAIL_REDEX.test(email);
    if (!v1 || !v2 || !v3 || !v4 || !v5 || !v6) {
      setErrMsg('Invalid Entry');
      return;
    }
    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({ firstName, lastName, pwd, email, role }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      console.log(response?.data);
      console.log(response?.accessToken);
      console.log(JSON.stringify(response));
      setSuccess(true);
      //clear state and controlled inputs
      //need value attrib on inputs for this
      setFirstName('');
      setLastName('');
      setRole('');
      setEmail('');
      setPwd('');
      setMatchPwd('');
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 409) {
        setErrMsg('Username Taken');
      } else {
        setErrMsg('Registration Failed');
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      {success ? (
        <section>
          <h1>Success!</h1>
          <p>
            <a href='#'>Sign In</a>
          </p>
        </section>
      ) : (
        <section>
          <p
            ref={errRef}
            className={errMsg ? 'errmsg' : 'offscreen'}
            aria-live='assertive'
          >
            {errMsg}
          </p>
          <h1>Register</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor='firstName'>
              First Name:
              <span className={validFirstName ? 'valid' : 'hide'}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span
                className={validFirstName || !firstName ? 'hide' : 'invlaid'}
              >
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              type='text'
              id='firstName'
              ref={fNameRef}
              autoComplete='off'
              onChange={(e) => setFirstName(e.target.value)}
              required
              aria-invalid={validFirstName ? 'false' : 'true'}
              aria-describedby='fnnote'
              onFocus={() => setFirstNameFocus(true)}
              onBlur={() => setFirstNameFocus(false)}
            />
            <p
              id='fnnote'
              className={
                firstNameFocus && firstName && !validFirstName
                  ? 'instruction'
                  : 'offscreen'
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} /> 3 to 24 characters.
              <br />
              Must begin with a letter.
              <br />
              Letter, number, underscore, hyphens allowd.
            </p>
            <label htmlFor='lastName'>
              Last Name:
              <span className={validLastName ? 'valid' : 'hide'}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={validLastName || !lastName ? 'hide' : 'invlaid'}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              type='text'
              id='lastName'
              autoComplete='off'
              onChange={(e) => setLastName(e.target.value)}
              required
              aria-invalid={validLastName ? 'false' : 'true'}
              aria-describedby='lnnote'
              onFocus={() => setLastNameFocus(true)}
              onBlur={() => setLastNameFocus(false)}
            />
            <p
              id='lnnote'
              className={
                lastNameFocus && lastName && !validLastName
                  ? 'instruction'
                  : 'offscreen'
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} /> 3 to 24 characters.
              <br />
              Must begin with a letter.
              <br />
              Letter, number, underscore, hyphens allowd.
              <br />
            </p>
            <label htmlFor='email'>
              Email:
              <span className={validEmail ? 'valid' : 'hide'}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={validEmail || !email ? 'hide' : 'invlaid'}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              type='text'
              id='email'
              autoComplete='off'
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-invalid={validEmail ? 'false' : 'true'}
              aria-describedby='enote'
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
            />
            <p
              id='enote'
              className={
                emailFocus && email && !validEmail ? 'instruction' : 'offscreen'
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} /> valid email format
            </p>
            <label htmlFor='role'>
              Role:
              <span className={validRole ? 'valid' : 'hide'}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={validRole || !role ? 'hide' : 'invlaid'}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              type='text'
              id='role'
              autoComplete='off'
              onChange={(e) => setRole(e.target.value)}
              required
              aria-invalid={validRole ? 'false' : 'true'}
              aria-describedby='rolenote'
              onFocus={() => setRoleFocus(true)}
              onBlur={() => setRoleFocus(false)}
            />
            <p
              id='rolenote'
              className={
                roleFocus && role && !validRole ? 'instruction' : 'offscreen'
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} /> Must begin with a letter.
              <br />
              Minimum 4 Letter
              <br />
            </p>
            <label htmlFor='password'>
              Password:
              <span className={validPwd ? 'valid' : 'hide'}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={validPwd || !pwd ? 'hide' : 'invlaid'}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              type='password'
              id='password'
              onChange={(e) => setPwd(e.target.value)}
              required
              aria-invalid={validPwd ? 'false' : 'true'}
              aria-describedby='pwdnote'
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
            />
            <p
              id='pwdnote'
              className={
                pwdFocus && pwd && !validPwd ? 'instruction' : 'offscreen'
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              8 to 24 characters.
              <br />
              Must include uppercase and lowercase letters, a number and a
              special characters.
              <br />
              Allowed special characters:{' '}
              <span aria-label='exclamation mark'> !,</span>
              <span aria-label='at symbol'>@,</span>
              <span aria-label='hashtag'>#,</span>
              <span aria-label='dollar'>$</span>
            </p>
            <label htmlFor='confirm_Pwd'>
              Confirm Password:
              <span className={validMatchPwd ? 'valid' : 'hide'}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={validMatchPwd || !matchPwd ? 'hide' : 'invlaid'}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              type='password'
              id='confirm_Pwd'
              autoComplete='off'
              onChange={(e) => setMatchPwd(e.target.value)}
              required
              aria-invalid={validMatchPwd ? 'false' : 'true'}
              aria-describedby='cfmpwdnote'
              onFocus={() => setMatchPwdFocus(true)}
              onBlur={() => setMatchPwdFocus(false)}
            />
            <p
              id='cfmpwdnote'
              className={
                matchPwdFocus && matchPwd && !validMatchPwd
                  ? 'instruction'
                  : 'offscreen'
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Must match the first password input field.
            </p>

            <button
              disabled={
                !validFirstName ||
                !validEmail ||
                !validLastName ||
                !validRole ||
                !validPwd ||
                !validMatchPwd
                  ? true
                  : false
              }
            >
              Sign Up
            </button>
          </form>
          <p>
            Already registered?
            <br />
            <span className='line'>
              {/*put router link here*/}
              <a href='#'>Sign In</a>
            </span>
          </p>
        </section>
      )}
    </>
  );
};

export default Register;
