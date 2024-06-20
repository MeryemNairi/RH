import * as React from 'react';
import { IFormProps, IFormData } from './services/BackOfficeService';
import { submitForm, getFormData, updateFormEntry } from './services/BackOfficeService';
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
    IdBoost: NaN,
    status: 'pending',
    city: '',
    code: '',
  });

  const [formEntries, setFormEntries] = React.useState<IFormData[]>([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [currentUserName, setCurrentUserName] = React.useState<string>("");

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
      <div className={styles.FirstBanner_container}>
        <div className={styles.background}>
          <div className={styles.bg_left}></div>
          <div className={styles.bg_right}></div>
        </div>
        <div className={styles.second_layer}></div>
        <div className={styles.content_layer}>
          <div className={styles.welcomeMessage}>
            <p>
              Bonjour {currentUserName || 'Utilisateur'} et Bienvenue sur les demandes RH !{' '}
              <span className={styles.newLine}></span> Veuillez sélectionner votre demande et remplir le formulaire. Vous
              recevrez votre demande dans les plus brefs délais.
            </p>
          </div>
        </div>
      </div>
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
                    value={formData.userEmail}
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
