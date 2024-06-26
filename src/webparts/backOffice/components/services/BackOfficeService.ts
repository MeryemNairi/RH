import { sp } from '@pnp/sp/presets/all';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IFormProps {
  context: WebPartContext;
}

export interface IFormData {
  id: number;
  offre_title: string;
  short_description: string;
  deadline: Date;
  userEmail: string;
  IdBoost: number;
  status: string;
  city: string;
  code: string; 
}

export const submitForm = async (formData: IFormData): Promise<number> => {
  try {
    const list = sp.web.lists.getByTitle('Communication');
    const newItem = await list.items.add({
      offre_title: formData.offre_title,
      short_description: formData.short_description,
      deadline: formData.deadline.toISOString(),
      userEmail: formData.userEmail,
      IdBoost: formData.IdBoost,
      status: formData.status,
      city: formData.city,
    });

    // Générer un code aléatoire de 4 chiffres
    const code = generateRandomCode();

    // Mettre à jour l'élément avec le code généré
    await newItem.item.update({
      code: code,
    });

    return code; // Retourner le code généré
  } catch (error) {
    console.error('Error submitting form:', error);
    throw new Error('An error occurred while submitting the form. Please try again.');
  }
};

export const getFormData = async (): Promise<IFormData[]> => {
  try {
    const list = sp.web.lists.getByTitle('Communication');
    const items = await list.items.select('Id', 'offre_title', 'short_description', 'deadline', 'userEmail', 'IdBoost', 'status', 'city', 'code').get();
    return items.map((item: any) => ({
      id: item.Id,
      offre_title: item.offre_title,
      short_description: item.short_description,
      deadline: new Date(item.deadline),
      userEmail: item.userEmail,
      IdBoost: item.IdBoost,
      status: item.status,
      city: item.city,
      code: item.code,
    }));
  } catch (error) {
    console.error('Error fetching form data:', error);
    throw new Error('An error occurred while fetching form data. Please try again.');
  }
};

export const updateFormEntry = async (id: number, formData: IFormData) => {
  try {
    const list = sp.web.lists.getByTitle('Communication');
    await list.items.getById(id).update({
      offre_title: formData.offre_title,
      short_description: formData.short_description,
      deadline: formData.deadline,
      userEmail: formData.userEmail,
      IdBoost: formData.IdBoost,
    });
  } catch (error) {
    console.error('Error updating form entry:', error);
    throw new Error('An error occurred while updating the form entry. Please try again.');
  }
};

export const deleteFormEntry = async (id: number) => {
  try {
    const list = sp.web.lists.getByTitle('Communication');
    await list.items.getById(id).delete();
  } catch (error) {
    console.error('Error deleting form entry:', error);
    throw new Error('An error occurred while deleting the form entry. Please try again.');
  }
};

// Fonction utilitaire pour générer un code aléatoire de 4 chiffres
const generateRandomCode = (): number => {
  return Math.floor(1000 + Math.random() * 9000);
};
