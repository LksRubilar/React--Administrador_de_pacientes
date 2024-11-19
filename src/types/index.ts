export type Patient = {
  id: string;
  name: string;
  caretaker: string;
  email: string;
  date: Date;
  symptoms: string;
  minLenght: string;
}

export type DraftPatient = Omit<Patient, 'id'>