import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { DraftPatient, Patient } from "./types";

//para que las funciones esten sincronizadas deben estar dentro de patient state.
//ASI, ESTA FIRMA Y EL STORE ESTAN SICRONZADOS
type PatientState = {
  patients: Patient[];
  activeId: Patient["id"];
  addPatient: (data: DraftPatient) => void;
  deletePatient: (id: Patient["id"]) => void;
  getPatientById: (id: Patient["id"]) => void;
  updatePatient: (data: DraftPatient) => void;
};

const createPatient = (patient: DraftPatient): Patient => {
  return { ...patient, id: uuidv4() };
};

//STORE QUE SE SINCRONIZA CON LA FIRMA DE MAS ARRIBA
// se puede usar set y get, para este caso solo usaremos set
export const usePatientStore = create<PatientState>()(
  devtools(
    persist(
      (set) => ({
        patients: [],
        activeId: "",
        addPatient: (data) => {
          const newPatient = createPatient(data);
          //la forma en la que recuperas o escribes es con set
          set((state) => ({
            patients: [...state.patients, newPatient],
          }));
        },
        deletePatient: (id) => {
          //seteamos el state para actualizar patient
          set((state) => ({
            //Sacamos el elemento de patients, mediante el filtro y solicitamos que traiga
            //todos los pacientes que sean diferentes al ID que le estamos pasando
            //eliminando unicamente ese paciente
            patients: state.patients.filter((patient) => patient.id !== id),
          }));
        },
        getPatientById: (id) => {
          set(() => ({
            activeId: id,
          }));
        },
        updatePatient: (data) => {
          set((state) => ({
            patients: state.patients.map((patient) =>
              patient.id === state.activeId
                ? { id: state.activeId, ...data }
                : patient
            ),
            activeId: "",
          }));
        },
      }),
      {
        name: "patient-storage",
      }
    )
  )
);
