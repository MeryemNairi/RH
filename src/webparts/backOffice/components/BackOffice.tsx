import * as React from 'react';

import { IFormProps, IFormData } from './services/BackOfficeService';

import { submitForm, getFormData, updateFormEntry } from './services/BackOfficeService';

import styles from './BackOffice.module.scss';

import { sp } from "@pnp/sp";

import Navbar from './Header/navbar';

import Footer from './NewFooter/Footer';

import FirstBanner from './First Banner/FB';





export const BackOffice: React.FC<IFormProps> = ({ context }) => {

  const [formData, setFormData] = React.useState<IFormData>({

    id: 0,

    offre_title: '',

    short_description: '',

    deadline: new Date(),

    userEmail: '',

    IdBoost: NaN,

    status: 'pending',

    city: '',

    code: '',

  });



  const [formEntries, setFormEntries] = React.useState<IFormData[]>([]);

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [, setCurrentUserName] = React.useState<string>("");



  React.useEffect(() => {

    fetchFormData();

    fetchCurrentUserName();

  }, []);



  const fetchFormData = async () => {

    try {

      const allFormData = await getFormData();

      const currentUser = await sp.web.currentUser.get();

      const filteredFormData = allFormData.filter(entry => entry.userEmail === currentUser.Email);

      setFormEntries(filteredFormData);

    } catch (error) {

      console.error('Error fetching form data:', error);

    }

  };



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {

    const { name, value } = e.target;



    if (name === 'IdBoost') {

      const intValue = parseInt(value, 10);



      if (!isNaN(intValue)) {

        setFormData(prevState => ({

          ...prevState,

          [name]: intValue,

        }));

      }

    } else {

      setFormData(prevState => ({

        ...prevState,

        [name]: value,

      }));

    }

  };



  const generateUniqueCode = (): string => {

    return Math.random().toString(36).substr(2, 9);

  };



  const isCodeDuplicate = (code: string): boolean => {

    return formEntries.some(entry => entry.code === code);

  };



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();



    setIsSubmitting(true);



    try {

      let generatedCode = generateUniqueCode(); // Générer un code unique

      while (isCodeDuplicate(generatedCode)) { // Vérifier si le code est déjà utilisé

        generatedCode = generateUniqueCode(); // Regénérer si le code est en double

      }



      if (formData.id) {

        await updateFormEntry(formData.id, { ...formData, code: generatedCode });

      } else {

        await submitForm({ ...formData, code: generatedCode });

      }



      setFormData({

        id: 0,

        offre_title: '',

        short_description: '',

        deadline: new Date(),

        userEmail: formData.userEmail,

        IdBoost: NaN,

        status: 'pending',

        city: '',

        code: generatedCode,

      });



      alert('Form submitted successfully!');

      fetchFormData();

    } catch (error) {

      console.error('Error submitting form:', error);

      alert('An error occurred while submitting the form. Please try again.');

    } finally {

      setIsSubmitting(false);

    }

  };



  const fetchCurrentUserName = async () => {

    try {

      const currentUser = await sp.web.currentUser.get();

      setCurrentUserName(currentUser.Title || "");

      setFormData(prevState => ({

        ...prevState,

        userEmail: currentUser.Email || "",

      }));

    } catch (error) {

      console.error("Error fetching current user name:", error);

    }

  };



  const options = [

    'Attestation de travail',

    'Attestation de salaire',

    'Domicialisation irrévocable de salaire',

    'Attestation de congé',

    'Attestation de salaire annuelle',

    'Borderaux de CNSS',

    'Attestation de titularisation',

    'Bulletins de paie cachetés',

  ];



  const cities = ['Rabat', 'Fes'];



  const getStatusStyle = (status: string): string => {

    switch (status) {

      case 'pending':

        return styles.statusPending;

      case 'in progress':

        return styles.statusInProgress;

      case 'resolved':

        return styles.statusResolved;

      case 'closed':

        return styles.statusClosed;

      case 'rejected':

        return styles.statusRejected;

      default:

        return '';

    }

  };



  return (

    <div>

      <Navbar />

      <FirstBanner context={context} />

      <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>

        <div style={{ display: 'flex', justifyContent: 'center' }}>

          <div>

            <div style={{ marginBottom: '90px' }}></div>

            <div style={{ position: 'relative' }}>

              <form className={styles.formContainer1} onSubmit={handleSubmit}>

                <div className={styles.inputField}>

                  <select name="offre_title" value={formData.offre_title} onChange={handleInputChange} required>

                    <option value="">Select an option</option>

                    {options.map((option, index) => (

                      <option key={index} value={option}>

                        {option}

                      </option>

                    ))}

                  </select>

                </div>

                <span>&nbsp;</span>

                <div className={styles.inputField}>

                  <input

                    type="email"

                    id="userEmail"

                    name="userEmail"

                    value={''}

                    onChange={handleInputChange}

                    placeholder="userEmail"

                    required

                  />

                </div>

                <span>&nbsp;</span>

                <div className={styles.inputField}>

                  <input

                    type="text"

                    id="IdBoost"

                    name="IdBoost"

                    value={formData.IdBoost || ''}

                    onChange={handleInputChange}

                    placeholder="IdBoost"

                    required

                  />

                </div>

                <span>&nbsp;</span>

                <div className={styles.inputField}>

                  <select name="city" value={formData.city} onChange={handleInputChange} required>

                    <option value="">Select a city</option>

                    {cities.map((city, index) => (

                      <option key={index} value={city}>

                        {city}

                      </option>

                    ))}

                  </select>

                </div>

                <span>&nbsp;</span>

                <div className={styles.inputField}>

                  <textarea

                    id="short_description"

                    name="short_description"

                    value={formData.short_description}

                    onChange={handleInputChange}

                    placeholder="Description"

                    style={{ backgroundColor: '#f8fffd', width: '690px', height: '200px' }}

                    className={styles.ShortDescription}

                  />

                </div>

                <span>&nbsp;</span>

                <div className={styles.inputContainer2}>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                    <div>

                      <button type="submit" className={styles.button} disabled={isSubmitting}>

                        Submit

                        <span style={{ marginLeft: '40px' }}>

                          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">

                            <path d="M19.5664 10.0226L0.601308 19.7933L0.376323 0.70157L19.5664 10.0226Z" fill="#9EBBE3" />

                          </svg>

                        </span>

                      </button>

                    </div>

                  </div>

                </div>

              </form>

              <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>

                <h2 className={styles.recordsTitle}>Historiques:</h2>

                <div className={styles.recordsContainer}>

                  {formEntries

                    .filter(entry => entry.userEmail === formData.userEmail)

                    .map((entry, index) => (

                      <div key={index} className={`${styles.record}`}>

                        <div className={styles.recordField}>Code: {entry.code}</div>

                        <div className={styles.recordField}>{entry.offre_title}</div>

                        <div className={styles.recordField}>{entry.short_description}</div>

                        <div className={styles.recordField}>{entry.deadline.toLocaleDateString()}</div>

                        <div className={styles.recordField}>{entry.userEmail}</div>

                        <div className={styles.recordField}>{entry.IdBoost}</div>

                        <div className={`${styles.recordField} ${getStatusStyle(entry.status)}`}>{entry.status}</div>

                        <div className={`${styles.recordField} ${styles.boldCity}`}>{entry.city}</div>

                        <div className={styles.recordField}>
                          <svg width="26" height="30" viewBox="0 0 26 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.10499 15.35C7.10499 14.59 6.57699 14.136 5.64599 14.136C5.26599 14.136 5.00899 14.173 4.87399 14.209V16.65C5.03399 16.686 5.22999 16.699 5.49899 16.699C6.49199 16.699 7.10499 16.196 7.10499 15.35ZM12.871 14.16C12.454 14.16 12.184 14.197 12.024 14.234V19.642C12.184 19.679 12.441 19.679 12.674 19.679C14.366 19.691 15.47 18.759 15.47 16.785C15.483 15.068 14.477 14.16 12.871 14.16Z" fill="#FE0000" />
                            <path d="M23.918 10.983H23.24V7.712L23.234 7.65C23.2346 7.51853 23.1882 7.39117 23.103 7.291L17.66 1.075L17.656 1.071C17.5868 0.996148 17.4987 0.94124 17.401 0.912004L17.371 0.902004C17.3295 0.891251 17.2868 0.885874 17.244 0.886004H3.867C3.256 0.886004 2.76 1.383 2.76 1.993V10.983H2.082C1.208 10.983 0.5 11.691 0.5 12.565V20.793C0.5 21.666 1.209 22.375 2.082 22.375H2.76V28.008C2.76 28.618 3.256 29.115 3.867 29.115H22.133C22.743 29.115 23.24 28.618 23.24 28.008V22.375H23.918C24.792 22.375 25.5 21.666 25.5 20.793V12.565C25.5 11.691 24.791 10.983 23.918 10.983ZM3.867 1.993H16.69V7.657C16.69 7.963 16.938 8.21 17.244 8.21H22.134V10.983H3.867V1.993ZM17.457 16.723C17.457 18.305 16.881 19.397 16.082 20.071C15.212 20.794 13.888 21.138 12.269 21.138C11.3 21.138 10.614 21.076 10.147 21.016V12.897C10.834 12.787 11.729 12.726 12.674 12.726C14.243 12.726 15.261 13.008 16.058 13.609C16.917 14.246 17.457 15.264 17.457 16.723ZM3.021 21.053V12.897C3.597 12.799 4.407 12.726 5.547 12.726C6.7 12.726 7.522 12.947 8.073 13.388C8.6 13.805 8.955 14.492 8.955 15.301C8.955 16.111 8.686 16.797 8.195 17.263C7.557 17.864 6.613 18.134 5.509 18.134C5.264 18.134 5.043 18.122 4.872 18.097V21.053H3.021ZM22.133 27.708H3.867V22.375H22.133V27.708ZM23.737 14.32H20.56V16.209H23.528V17.73H20.56V21.053H18.685V12.787H23.737V14.32Z" fill="#FE0000" />
                          </svg>
                        </div>

                      </div>

                    ))}

                </div>

              </div>

            </div>

            <div style={{ marginBottom: '50px' }}></div>

          </div>

        </div>

      </div>

      <Footer />

    </div>

  );

};



export default BackOffice;

