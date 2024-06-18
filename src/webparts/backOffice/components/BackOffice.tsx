import * as React from 'react';
import { IFormProps, IFormData } from './services/BackOfficeService';
import { submitForm, getFormData, updateFormEntry, deleteFormEntry } from './services/BackOfficeService';
import styles from './BackOffice.module.scss';
import { sp } from "@pnp/sp";
import Navbar from './Header/navbar';
import Footer from './Footer/footer';

export const BackOffice: React.FC<IFormProps> = ({ context }) => {
  const [formData, setFormData] = React.useState<IFormData>({
    id: 0,
    offre_title: '',
    short_description: '',
    deadline: new Date(),
    userEmail: '',
    IdBoost:  NaN,  
    status: 'pending', 
  });

  const [formEntries, setFormEntries] = React.useState<IFormData[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [currentUserEmail, setCurrentUserEmail] = React.useState<string>("");

  React.useEffect(() => {
    fetchFormData();
    fetchCurrentUserEmail(); 
  }, []);

  const fetchFormData = async () => {
    try {
      const formData = await getFormData();
      setFormEntries(formData);
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
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      if (formData.id) {
        await updateFormEntry(formData.id, formData);
      } else {
        await submitForm(formData);
      }
      setFormData({
        id: 0,
        offre_title: '',
        short_description: '',
        deadline: new Date(),
        userEmail: '', // Reset userEmail to empty
        IdBoost:  NaN,  // Reset IdBoost to empty string
        status: 'pending',
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

  const handleDeleteEntry = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await deleteFormEntry(id);
        alert('Form entry deleted successfully!');
        fetchFormData();
      } catch (error) {
        console.error('Error deleting form entry:', error);
        alert('An error occurred while deleting the form entry. Please try again.');
      }
    }
  };

  const fetchCurrentUserEmail = async () => {
    try {
      const currentUser = await sp.web.currentUser.get();
      setCurrentUserEmail(currentUser.Email || ""); // Set the current user's email to state
      setFormData(prevState => ({
        ...prevState,
        userEmail: currentUser.Email || "",
      }));
    } catch (error) {
      console.error("Error fetching current user email:", error);
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

  return (
    <div>
      <Navbar />
      <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div>
            <div style={{ marginBottom: '50px' }}></div>
            <div style={{ position: 'relative' }}>
              <form className={styles.formContainer1} onSubmit={handleSubmit}>
                <div className={styles.inputField}>
                  <select
                    name="offre_title"
                    value={formData.offre_title}
                    onChange={handleInputChange}
                    required  // Adding required attribute for validation
                  >
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
                    value={currentUserEmail} 
                    onChange={handleInputChange}
                    disabled  
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
                  <textarea
                    id="short_description"
                    name="short_description"
                    value={formData.short_description}
                    onChange={handleInputChange}
                    placeholder="Description"
                    style={{ backgroundColor: '#F5F9FF', width: '690px', height: '200px' }}
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
                  {formEntries.map((entry, index) => (
                    <div key={index} className={styles.record}>
                      <div className={styles.recordField}>{entry.offre_title}</div>
                      <div className={styles.recordField}>{entry.short_description}</div>
                      <div className={styles.recordField}>{entry.deadline.toLocaleDateString()}</div>
                      <div className={styles.recordField}>{entry.userEmail}</div>
                      <div className={styles.recordField}>{entry.IdBoost}</div>
                      <div className={styles.recordField}>{entry.status}</div>

                      <div className={styles.recordField}>
                        <span className={styles.iconSpace}></span>
                        <svg
                          width="28"
                          height="28"
                          viewBox="0 0 42 42"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={() => handleDeleteEntry(entry.id)}
                        >
                          <path d="M33.25 7H27.125L25.375 5.25H16.625L14.875 7H8.75V10.5H33.25M10.5 33.25C10.5 34.1783 10.8687 35.0685 11.5251 35.7249C12.1815 36.3813 13.0717 36.75 14 36.75H28C28.9283 36.75 29.8185 36.3813 30.4749 35.7249C31.1313 35.0685 31.5 34.1783 31.5 33.25V12.25H10.5V33.25Z" fill="#FF5454" />
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
