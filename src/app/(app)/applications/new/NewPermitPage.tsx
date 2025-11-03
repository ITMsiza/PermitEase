
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Breadcrumb } from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Icons } from '@/components/icons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { auth } from "@/lib/firebase"; // Update path if necessary

/*interface ApplicationFormData {
  applicationIdDisplay: string | null;
  applicationType: string;
  amendmentType?: string;
  serviceType: string;
  applyingAs: 'individual' | 'company' | '';
  appCompany?: string; // Affiliated With
  identificationType?: 'sa_id' | 'sa_passport' | 'foreign_passport' | '';
  fullName?: string;
  saIdNumber?: string;
  saIdDocumentFile?: File | null;
  saPassportNumber?: string;
  saPassportDocumentFile?: File | null;
  foreignPassportNumber?: string;
  foreignPassportDocumentFile?: File | null;
  driversLicenceNumber?: string;
  driversLicenceFile?: File | null;
  companyName?: string;
  companyRegistrationNumber?: string;
  companyRegistrationDocumentFile?: File | null;
  tradeName?: string;
  businessType?: string;
  companyMemorandumOfUnderstanding?: boolean;
  companyMemorandumOfUnderstandingFile?: File | null;
  companyCertificateOfIncorporation?: boolean;
  companyCertificateOfIncorporationFile?: File | null;
  companyFoundingStatement?: boolean;
  companyFoundingStatementFile?: File | null;
  incomeTaxNumber?: string;
  taxClearanceCertificateFile?: File | null;
  postalAddressStreet?: string;
  postalAddressSuburb?: string;
  postalAddressCity?: string;
  postalCode?: string;
  domiciliumCitandi?: string;
  isStreetAddressSameAsPostal?: boolean;
  streetAddressStreet?: string;
  streetAddressSuburb?: string;
  streetAddressCity?: string;
  streetPostalCode?: string;
  telephoneCode?: string;
  telephoneNumber?: string;
  emailAddress?: string;
}*/

interface ApplicationFormData {
  // ... (Your existing and new fields here)
   applicationIdDisplay: string | null;
   applicationType: string; // This field is likely intended for the new section
   amendmentType?: string;
   serviceType: string; // Keep this existing field
   applyingAs: 'individual' | 'company' | '';
    appCompany?: string; // Affiliated With
   identificationType?: 'sa_id' | 'sa_passport' | 'foreign_passport' | '';
    // Add other existing fields here
    fullName?: string;
    saIdNumber?: string;
    saIdDocumentFile?: File | null;
    saPassportNumber?: string;
    saPassportDocumentFile?: File | null;
    foreignPassportNumber?: string;
    foreignPassportDocumentFile?: File | null;
    driversLicenceNumber?: string;
    driversLicenceFile?: File | null;

    companyName?: string;
    companyRegistrationNumber?: string;
    companyRegistrationDocumentFile: File | null;
    tradeName?: string;
    businessType?: string;
    companyMemorandumOfUnderstanding: boolean;
    companyMemorandumOfUnderstandingFile: File | null;
    companyCertificateOfIncorporation: boolean;
    companyCertificateOfIncorporationFile: File | null;
    companyFoundingStatement: boolean;
    companyFoundingStatementFile: File | null;

    incomeTaxNumber?: string;
    taxClearanceCertificateFile: File | null;

     // Address fields (from your snippet)
    postalAddressStreet: string;
    postalAddressSuburb: string; // Keep this existing field
    postalAddressCity: string; // Keep this existing field
    postalCode: string;
    domiciliumCitandi: string;
    isStreetAddressSameAsPostal: boolean;
    streetAddressStreet?: string;
    streetAddressSuburb?: string;
    streetAddressCity?: string;
    streetPostalCode?: string;

    // --- NEW FIELDS (for the new sections) ---

    /*/ Application Type (using new names to avoid conflict if needed, adjust as required)
    newApplicationTypeSelection: string;
    newPermitSubTypeSelection: string;*/

    // Contact Information (new fields not covered by existing address)

    telephoneCode?: string;
    telephoneNumber: string;
    emailAddress: string;

    // Vehicle Information
    vehicleType: string;
    vehicleMake: string;
    vehicleModel: string;
    vehicleYear: number | '';
    vehicleVIN: string;
    vehicleRegistrationNumber: string;
    vehicleOwnershipDocumentFile: File | null;
    vehicleLicenseDiscFile: File | null;
}


/*const initialFormData: ApplicationFormData = {
  applicationIdDisplay: null,
  applicationType: '',
  serviceType: '',
  amendmentType: '',
  applyingAs: '',
  appCompany: undefined,
  identificationType: '',
  fullName: undefined,
  saIdNumber: undefined,
  saIdDocumentFile: null,
  saPassportNumber: undefined,
  saPassportDocumentFile: null,
  foreignPassportNumber: undefined,
  foreignPassportDocumentFile: null,
  driversLicenceNumber: undefined,
  driversLicenceFile: null,
  companyName: undefined,
  companyRegistrationNumber: undefined,
  companyRegistrationDocumentFile: null,
  tradeName: undefined,
  businessType: undefined,
  companyMemorandumOfUnderstanding: false,
  companyMemorandumOfUnderstandingFile: null,
  companyCertificateOfIncorporation: false,
  companyCertificateOfIncorporationFile: null,
  companyFoundingStatement: false,
  companyFoundingStatementFile: null,
  incomeTaxNumber: undefined,
  taxClearanceCertificateFile: null,
  isStreetAddressSameAsPostal: false,
  postalAddressStreet: '',
  postalAddressSuburb: '',
  postalAddressCity: '',
  postalCode: '',
  domiciliumCitandi: '',
  streetAddressStreet: '',
  streetAddressSuburb: '',
  streetAddressCity: '',
  streetPostalCode: '',
  telephoneCode: '+27',
  telephoneNumber: '',
  emailAddress: '',
};*/

const initialFormData: ApplicationFormData = {
  applicationIdDisplay: null,
  applicationType: '',
  amendmentType: '',
  serviceType: '',

  applyingAs: '',
  appCompany: undefined,

  // Identification
  identificationType: '',
  fullName: undefined,
  saIdNumber: undefined,
  saIdDocumentFile: null,
  saPassportNumber: undefined,
  saPassportDocumentFile: null,
  foreignPassportNumber: undefined,
  foreignPassportDocumentFile: null,
  driversLicenceNumber: undefined,
  driversLicenceFile: null,

  // Company Information
  companyName: undefined,
  companyRegistrationNumber: undefined,
  companyRegistrationDocumentFile: null,
  tradeName: undefined,
  businessType: undefined,
  companyMemorandumOfUnderstanding: false,
  companyMemorandumOfUnderstandingFile: null,
  companyCertificateOfIncorporation: false,
  companyCertificateOfIncorporationFile: null,
  companyFoundingStatement: false,
  companyFoundingStatementFile: null,

  // Tax Information
  incomeTaxNumber: undefined,
  taxClearanceCertificateFile: null,

  // Address Information
  postalAddressStreet: '',
  postalAddressSuburb: '',
  postalAddressCity: '',
  postalCode: '',
  domiciliumCitandi: '',
  isStreetAddressSameAsPostal: false,
  streetAddressStreet: '',
  streetAddressSuburb: '',
  streetAddressCity: '',
  streetPostalCode: '',

  // --- NEW FIELDS (for new sections) ---

  /*/ Application Type
  newApplicationTypeSelection: '',
  newPermitSubTypeSelection: '',*/

  // Contact Information
  telephoneCode: '+27',
  telephoneNumber: '',
  emailAddress: '',

  // Vehicle Information
  vehicleType: '',
  vehicleMake: '',
  vehicleModel: '',
  vehicleYear: '',
  vehicleVIN: '',
  vehicleRegistrationNumber: '',
  vehicleOwnershipDocumentFile: null,
  vehicleLicenseDiscFile: null,
};


const suburbOptions = [
  { value: "Suburb A", label: "Suburb A" },
  { value: "Suburb B", label: "Suburb B" },
  { value: "Suburb C", label: "Suburb C" },
  { value: "Other", label: "Other" },
];

const cityOptions = [
  { value: "City X", label: "City X" },
  { value: "City Y", label: "City Y" },
  { value: "City Z", label: "City Z" },
  { value: "Other", label: "Other" },
];

const serviceTypeOptions = [
  { value: "e-hailing", label: "E-hailing" },
  { value: "metered-taxi", label: "Metered Taxi Service" },
  { value: "minibus-taxi", label: "Minibus taxi-type service" },
  { value: "scheduled-bus", label: "Scheduled bus service" },
  { value: "staff-service", label: "Staff Service" },
  { value: "charter-service", label: "Charter Service" },
  { value: "courtesy-service", label: "Courtesy Service" },
  { value: "scholar-service", label: "Scholar Service" },
  { value: "other", label: "Other Service" },
];

const appCompanyOptions = [
    { value: "EaziRide", label: "EaziRide" },
    { value: "Uber", label: "Uber" },
    { value: "Bolt", label: "Bolt" },
    { value: "InDrive", label: "InDrive" },
];

const applicationTypeOptions = [
    { value: "New", label: "New operating licence" },
    { value: "Transfer", label: "Transfer of an operating licence or permit" },
    { value: "Route Amendment", label: "Amendment of an operating licence or permit" },
    { value: "Renewal", label: "Renewal of an operating licence or permit" },
    { value: "Conversion", label: "Conversion of a permit to an operating licence" },
   ];

const amendmentOptions = [
    { value: "3a", label: "3a) Amendment - Additional authority" },
    { value: "3b", label: "3b) Amendment - Amendment of route or area" },
    { value: "3c", label: "3c) Amendment - Change of particulars" },
    { value: "3e", label: "3e) Amendment - Amendment of timetables, tariffs or other conditions" },
    { value: "3f", label: "3f) Amendment - Replace existing vehicle" },
    { value: "3g", label: "3g) Amendment - OL for recapitalized vehicle" },
];
//
const individualIdentificationOptions = [
    { value: "sa_id", label: "SA ID Card" },
    { value: "sa_passport", label: "SA Passport" },
    { value: "foreign_passport", label: "Foreign Passport" },
];

const applicantScopeOptions = [
    { value: "individual", label: "Individual" },
    { value: "company", label: "Company / Legal Entity" },
];

const isApplicantDataValid = (data: ApplicationFormData): boolean => {
  if (!data.applicationType) return false;
  if (data.applicationType === 'Route Amendment' && !data.amendmentType) return false;

  if (!data.serviceType) return false;
  if (!data.applyingAs) return false;

  if (data.serviceType === 'e-hailing' && !data.appCompany) return false;

  if (data.applyingAs === 'individual') {
    if (!data.identificationType) return false;
    if (data.identificationType === 'sa_id') {
        if (!data.fullName) return false;
        if (!data.saIdNumber || !data.saIdDocumentFile) return false;
        if (!data.driversLicenceNumber || !data.driversLicenceFile) return false;
        if (!data.incomeTaxNumber || !data.taxClearanceCertificateFile) return false;
    } else if (data.identificationType === 'sa_passport') {
        if (!data.fullName) return false;
        if (!data.saPassportNumber || !data.saPassportDocumentFile) return false;
        if (!data.driversLicenceNumber || !data.driversLicenceFile) return false;
    } else if (data.identificationType === 'foreign_passport') {
        if (!data.fullName) return false;
        if (!data.foreignPassportNumber || !data.foreignPassportDocumentFile) return false;
        if (!data.driversLicenceNumber || !data.driversLicenceFile) return false;
    }
  } else if (data.applyingAs === 'company') {
    if (!data.companyName || !data.companyRegistrationNumber || !data.companyRegistrationDocumentFile || !data.tradeName || !data.businessType) return false;
    const mouValid = !data.companyMemorandumOfUnderstanding || (data.companyMemorandumOfUnderstanding && data.companyMemorandumOfUnderstandingFile);
    const coiValid = !data.companyCertificateOfIncorporation || (data.companyCertificateOfIncorporation && data.companyCertificateOfIncorporationFile);
    const fsValid = !data.companyFoundingStatement || (data.companyFoundingStatement && data.companyFoundingStatementFile);
    if (!(mouValid && coiValid && fsValid)) return false;
    if (!data.incomeTaxNumber || !data.taxClearanceCertificateFile) return false;
  } else {
      return false;
  }

  return true;
};

const isAddressInfoValid = (data: ApplicationFormData): boolean => {
  if (!data.postalAddressStreet || !data.postalAddressSuburb || !data.postalAddressCity || !data.postalCode || !data.domiciliumCitandi) return false;
  if (data.isStreetAddressSameAsPostal === false) {
    if (!data.streetAddressStreet || !data.streetAddressSuburb || !data.streetAddressCity || !data.streetPostalCode) return false;
  }
  if (!data.telephoneCode || !data.telephoneNumber || !data.emailAddress) return false;
  return true;
};

const formSectionsConfig = [
  { id: "applicantData", title: "Applicant Data", IconComponent: Icons.user, validator: isApplicantDataValid },
  { id: "addressInfo", title: "Address Info", IconComponent: Icons.mapPin, validator: isAddressInfoValid },
  { id: "documentation", title: "Documentation", IconComponent: Icons.paperclip, validator: () => true },
  { id: "vehicleData", title: "Vehicle Data", IconComponent: Icons.carFront, validator: () => true },
  { id: "audit", title: "Audit", IconComponent: Icons.clipboardCheck, validator: () => true },
  { id: "workflows", title: "Workflows", IconComponent: Icons.workflow, validator: () => true },
  { id: "notifications", title: "Notifications", IconComponent: Icons.bell, validator: () => true },
  { id: "status", title: "Status", IconComponent: Icons.info, validator: () => true },
];

const getDisplayApplicationType = (value?: string) => {
  return applicationTypeOptions.find(opt => opt.value === value)?.label || 'Not Selected';
};

const getDisplayServiceType = (value?: string) => {
  return serviceTypeOptions.find(opt => opt.value === value)?.label || 'Not Selected';
};

const getDisplayApplicantType = (value?: 'individual' | 'company' | '') => {
  if (value === 'individual') return 'Individual';
  if (value === 'company') return 'Company / Legal Entity';
  return 'Not Selected';
};


export default function NewPermitPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [formData, setFormData] = useState<ApplicationFormData>(initialFormData);
  const [initializedFromQuery, setInitializedFromQuery] = useState(false);
  const [isApplicationTypePreSelected, setIsApplicationTypePreSelected] = useState(false);
  const [displayDate, setDisplayDate] = useState<string>('');

  const initialActiveTab = formSectionsConfig[0].id;
  const [activeTabId, setActiveTabId] = useState<string>(initialActiveTab);

  useEffect(() => {
    const now = new Date();
    setDisplayDate(now.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' }));
  }, []);

  useEffect(() => {
    if (initializedFromQuery) return;

    const queryAppType = searchParams.get('applicationType');
    const validAppTypes = ['New', 'Tranfer', 'Route Amendment', 'Renewal', 'Conversion'];

    if (queryAppType && validAppTypes.includes(queryAppType)) {
      setFormData(prev => ({
        ...initialFormData,
        applicationType: queryAppType,
 amendmentType: queryAppType === 'Route Amendment' ? prev.amendmentType : undefined,
        telephoneCode: prev.telephoneCode || initialFormData.telephoneCode,
      }));
      setIsApplicationTypePreSelected(true);
    } else {
      setFormData(prev => ({
        ...initialFormData,
        applicationType: '', // Reset to empty if no valid query param
 telephoneCode: prev.telephoneCode || initialFormData.telephoneCode,
      }));
      setIsApplicationTypePreSelected(false);
    }
    setActiveTabId(formSectionsConfig[0].id);
    setInitializedFromQuery(true);
  }, [searchParams, initializedFromQuery]);


  const handleCancelFlow = () => {
    router.push('/dashboard');
  };

  const resetIdentityAndCompanyFields = (state: ApplicationFormData): ApplicationFormData => {
    state.identificationType = '';
    state.fullName = undefined;
    state.saIdNumber = undefined;
    state.saIdDocumentFile = null;
    state.saPassportNumber = undefined;
    state.saPassportDocumentFile = null;
    state.foreignPassportNumber = undefined;
    state.foreignPassportDocumentFile = null;
    state.driversLicenceNumber = undefined;
    state.driversLicenceFile = null;

    state.companyName = undefined;
    state.companyRegistrationNumber = undefined;
    state.companyRegistrationDocumentFile = null;
    state.tradeName = undefined;
    state.businessType = undefined;
    state.companyMemorandumOfUnderstanding = false;
    state.companyMemorandumOfUnderstandingFile = null;
    state.companyCertificateOfIncorporation = false;
    state.companyCertificateOfIncorporationFile = null;
    state.companyFoundingStatement = false;
    state.companyFoundingStatementFile = null;

    state.incomeTaxNumber = undefined;
    state.taxClearanceCertificateFile = null;
    return state;
  };

  const handleApplicationTypeChange = (value: string) => {
    setFormData(prev => ({
      ...initialFormData,
      applicationIdDisplay: prev.applicationIdDisplay,
 applicationType: value,
      amendmentType: value === 'Route Amendment' ? prev.amendmentType : undefined,
      telephoneCode: prev.telephoneCode || initialFormData.telephoneCode,
    }));
  };

  const handleAmendmentTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, amendmentType: value }));
  };

  const handleInputChange = (field: keyof ApplicationFormData, value: string | File | null | boolean) => {
    setFormData((prev: ApplicationFormData) => {
      let newState = { ...prev, [field]: value };

      if (field === 'applicationType') {
        newState.serviceType = '';
        newState.applyingAs = '';
        newState.appCompany = undefined;
        newState = resetIdentityAndCompanyFields(newState);
      } else if (field === 'serviceType') {
        newState.applyingAs = '';
        newState.appCompany = undefined;
        newState = resetIdentityAndCompanyFields(newState);
      } else if (field === 'applyingAs') {
        const preservedAppCompany = newState.serviceType === 'e-hailing' ? newState.appCompany : undefined;
        newState = resetIdentityAndCompanyFields(newState);
        newState.appCompany = preservedAppCompany;
      } else if (field === 'appCompany' && newState.applyingAs === 'individual') {
        newState.identificationType = '';
        newState.fullName = undefined;
        newState.saIdNumber = undefined;
        newState.saIdDocumentFile = null;
        newState.saPassportNumber = undefined;
        newState.saPassportDocumentFile = null;
        newState.foreignPassportNumber = undefined;
        newState.foreignPassportDocumentFile = null;
        newState.driversLicenceNumber = undefined;
        newState.driversLicenceFile = null;
        if (!newState.identificationType) {
            newState.incomeTaxNumber = undefined;
            newState.taxClearanceCertificateFile = null;
        }
      } else if (field === 'identificationType') {
          newState.saIdNumber= undefined;
          newState.saIdDocumentFile= null;
          newState.saPassportNumber= undefined;
          newState.saPassportDocumentFile= null;
          newState.foreignPassportNumber= undefined;
          newState.foreignPassportDocumentFile= null;
          newState.driversLicenceNumber= undefined;
          newState.driversLicenceFile= null;
          newState.incomeTaxNumber = undefined;
          newState.taxClearanceCertificateFile = null;
          if (value === 'sa_id') {
             newState.fullName = prev.fullName;
          } else {
             newState.fullName = undefined;
          }
      }

      if (newState.serviceType !== 'e-hailing') {
        newState.appCompany = undefined;
      }

      if (field === 'isStreetAddressSameAsPostal' && value === true) {
        newState.streetAddressStreet = newState.postalAddressStreet;
        newState.streetAddressSuburb = newState.postalAddressSuburb;
        newState.streetAddressCity = newState.postalAddressCity;
        newState.streetPostalCode = newState.postalCode;
      } else if (field === 'isStreetAddressSameAsPostal' && value === false) {
        newState.streetAddressStreet = '';
        newState.streetAddressSuburb = '';
        newState.streetAddressCity = '';
        newState.streetPostalCode = '';
      }

      if (field === 'companyMemorandumOfUnderstanding' && value === false) {
        newState.companyMemorandumOfUnderstandingFile = null;
      }
      if (field === 'companyCertificateOfIncorporation' && value === false) {
        newState.companyCertificateOfIncorporationFile = null;
      }
      if (field === 'companyFoundingStatement' && value === false) {
        newState.companyFoundingStatementFile = null;
      }
      return newState;
    });
  };

  const isCurrentTabValid = useMemo(() => {
    const currentTabConfig = formSectionsConfig.find(tab => tab.id === activeTabId);
    if (currentTabConfig && currentTabConfig.validator) {
      return currentTabConfig.validator(formData);
    }
    return true;
  }, [activeTabId, formData]);

  const goToNextTab = () => {
    const currentIndex = formSectionsConfig.findIndex(tab => tab.id === activeTabId);
    if (currentIndex < formSectionsConfig.length - 1) {
      setActiveTabId(formSectionsConfig[currentIndex + 1].id);
    }
  };

  //-------------------------------------------
  const fileToBase64 = (file: File | null): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!file) return resolve(null);
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  };
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    const fileFields = [
      'saIdDocumentFile',
      'saPassportDocumentFile',
      'foreignPassportDocumentFile',
      'driversLicenceFile',
      'companyRegistrationDocumentFile',
      'companyMemorandumOfUnderstandingFile',
      'companyCertificateOfIncorporationFile',
      'companyFoundingStatementFile',
      'taxClearanceCertificateFile',
      'vehicleOwnershipDocumentFile',
      'vehicleLicenseDiscFile',
    ] as const;
  
    // Convert files to base64
    const filePromises = fileFields.map(field => fileToBase64(formData[field] || null));
    const base64Files = await Promise.all(filePromises);
  
    // Optional: Set generated ID early if missing
    let newApplicationId = formData.applicationIdDisplay;
    if (!newApplicationId) {
      newApplicationId = `PW-${String(Date.now()).slice(-4)}-${Math.floor(Math.random() * 100)}`;
      setFormData(prev => ({ ...prev, applicationIdDisplay: newApplicationId }));
    }
  
    /*const applicationData: ApplicationFormData = {
      ...(formData as any),
      applicationIdDisplay: newApplicationId || null,
      applicationType: formData.applicationType,
      serviceType: formData.serviceType,
      applyingAs: formData.applyingAs,
      amendmentType: formData.amendmentType || null,
      appCompany: formData.appCompany || null,
      identificationType: formData.identificationType || null,
      fullName: formData.fullName || null,
      saIdNumber: formData.saIdNumber || null,
      saIdDocumentFile: base64Files[0],
      saPassportNumber: formData.saPassportNumber || null,
      saPassportDocumentFile: base64Files[1],
      foreignPassportNumber: formData.foreignPassportNumber || null,
      foreignPassportDocumentFile: base64Files[2],
      driversLicenceNumber: formData.driversLicenceNumber || null,
      driversLicenceFile: base64Files[3],
      companyName: formData.companyName || null,
      companyRegistrationNumber: formData.companyRegistrationNumber || null,
      companyRegistrationDocumentFile: base64Files[4],
      tradeName: formData.tradeName || null,
      businessType: formData.businessType || null,
      companyMemorandumOfUnderstanding: formData.companyMemorandumOfUnderstanding || false,
      companyMemorandumOfUnderstandingFile: base64Files[5],
      companyCertificateOfIncorporation: formData.companyCertificateOfIncorporation || false,
      companyCertificateOfIncorporationFile: base64Files[6],
      companyFoundingStatement: formData.companyFoundingStatement || false,
      companyFoundingStatementFile: base64Files[7],
      incomeTaxNumber: formData.incomeTaxNumber || null,
      taxClearanceCertificateFile: base64Files[8],
      postalAddressStreet: formData.postalAddressStreet || '',
      postalAddressSuburb: formData.postalAddressSuburb || '',
      postalAddressCity: formData.postalAddressCity || '',
      postalCode: formData.postalCode || '',
      domiciliumCitandi: formData.domiciliumCitandi || '',
      isStreetAddressSameAsPostal: formData.isStreetAddressSameAsPostal || false,
      streetAddressStreet: formData.streetAddressStreet || '',
      streetAddressSuburb: formData.streetAddressSuburb || '',
      streetAddressCity: formData.streetAddressCity || '',
      streetPostalCode: formData.streetPostalCode || '',
      telephoneCode: formData.telephoneCode || '+27',
      telephoneNumber: formData.telephoneNumber || '',
      emailAddress: formData.emailAddress || '',
    };*/

    const applicationData: ApplicationFormData = {
      ...(formData as any),
    
      // --- Core Application Info ---
      applicationIdDisplay: newApplicationId || null,
      applicationType: formData.applicationType,
      serviceType: formData.serviceType,
      applyingAs: formData.applyingAs,
      amendmentType: formData.amendmentType || null,
      appCompany: formData.appCompany || null,
    
      // --- Identification Info ---
      identificationType: formData.identificationType || null,
      fullName: formData.fullName || null,
      saIdNumber: formData.saIdNumber || null,
      saIdDocumentFile: base64Files[0],
      saPassportNumber: formData.saPassportNumber || null,
      saPassportDocumentFile: base64Files[1],
      foreignPassportNumber: formData.foreignPassportNumber || null,
      foreignPassportDocumentFile: base64Files[2],
      driversLicenceNumber: formData.driversLicenceNumber || null,
      driversLicenceFile: base64Files[3],
    
      // --- Company Info ---
      companyName: formData.companyName || null,
      companyRegistrationNumber: formData.companyRegistrationNumber || null,
      companyRegistrationDocumentFile: base64Files[4],
      tradeName: formData.tradeName || null,
      businessType: formData.businessType || null,
      companyMemorandumOfUnderstanding: formData.companyMemorandumOfUnderstanding || false,
      companyMemorandumOfUnderstandingFile: base64Files[5],
      companyCertificateOfIncorporation: formData.companyCertificateOfIncorporation || false,
      companyCertificateOfIncorporationFile: base64Files[6],
      companyFoundingStatement: formData.companyFoundingStatement || false,
      companyFoundingStatementFile: base64Files[7],
    
      // --- Tax Info ---
      incomeTaxNumber: formData.incomeTaxNumber || null,
      taxClearanceCertificateFile: base64Files[8],
    
      // --- Address Info ---
      postalAddressStreet: formData.postalAddressStreet || '',
      postalAddressSuburb: formData.postalAddressSuburb || '',
      postalAddressCity: formData.postalAddressCity || '',
      postalCode: formData.postalCode || '',
      domiciliumCitandi: formData.domiciliumCitandi || '',
      isStreetAddressSameAsPostal: formData.isStreetAddressSameAsPostal || false,
      streetAddressStreet: formData.streetAddressStreet || '',
      streetAddressSuburb: formData.streetAddressSuburb || '',
      streetAddressCity: formData.streetAddressCity || '',
      streetPostalCode: formData.streetPostalCode || '',
    
      /*/ --- Application Type (New Fields) ---
      newApplicationTypeSelection: formData.newApplicationTypeSelection || '',
      newPermitSubTypeSelection: formData.newPermitSubTypeSelection || '',*/
    
      // --- Contact Info (Updated Field Names) ---
      telephoneCode: formData.telephoneCode || '+27',
      telephoneNumber: formData.telephoneNumber || '',
      emailAddress: formData.emailAddress || '',
    
      // --- Vehicle Information ---
      vehicleType: formData.vehicleType || '',
      vehicleMake: formData.vehicleMake || '',
      vehicleModel: formData.vehicleModel || '',
      vehicleYear: formData.vehicleYear || '',
      vehicleVIN: formData.vehicleVIN || '',
      vehicleRegistrationNumber: formData.vehicleRegistrationNumber || '',
      vehicleOwnershipDocumentFile: base64Files[9],
      vehicleLicenseDiscFile: base64Files[10],
    };
    
  
    try {
      //  No token — public test
      const response = await fetch('/api/submit-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });
  
      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        const errorText = contentType?.includes("application/json")
          ? await response.json()
          : await response.text();
        console.error("Submission failed:", errorText);
        return;
      }
  
      const result = await response.json();
      console.log('Submission successful:', result);

      // *** Add this line to dispatch a custom event ***
    window.dispatchEvent(new CustomEvent('applicationSubmitted'));

    // Optionally, redirect the user or show a success message

  
    } catch (error) {
      console.error('An error occurred during submission:', error);
    }

     /*/---------------------------------------Code for UI part----------------------
     if (!formData.applicationIdDisplay) {
      const newApplicationId = `PW-${String(Date.now()).slice(-4)}-${Math.floor(Math.random() * 100)}`;
      applicationData.applicationIdDisplay = newApplicationId;
      setFormData(prev => ({ ...prev, applicationIdDisplay: newApplicationId })); // Update local state for display
    }*/
  };
  





  /*const handleSubmit = async () => {
    const fileFields = [
      'saIdDocumentFile',
      'saPassportDocumentFile',
      'foreignPassportDocumentFile',
      'driversLicenceFile',
      'companyRegistrationDocumentFile',
      'companyMemorandumOfUnderstandingFile',
      'companyCertificateOfIncorporationFile',
      'companyFoundingStatementFile',
      'taxClearanceCertificateFile',
    ] as const;
  
    // Convert files to base64
    const filePromises = fileFields.map(field => fileToBase64(formData[field] || null));
    const base64Files = await Promise.all(filePromises);
  
    // Optional: Set generated ID early if missing
    let newApplicationId = formData.applicationIdDisplay;
    if (!newApplicationId) {
      newApplicationId = `PW-${String(Date.now()).slice(-4)}-${Math.floor(Math.random() * 100)}`;
      setFormData(prev => ({ ...prev, applicationIdDisplay: newApplicationId }));
    }
  
    // Construct the final applicationData object
    const applicationData: ApplicationFormData = {
      ...(formData as any), // fallback
      applicationIdDisplay: newApplicationId || null,
      applicationType: formData.applicationType,
      serviceType: formData.serviceType,
      applyingAs: formData.applyingAs,
      amendmentType: formData.amendmentType || null,
      appCompany: formData.appCompany || null,
      identificationType: formData.identificationType || null,
      fullName: formData.fullName || null,
      saIdNumber: formData.saIdNumber || null,
      saIdDocumentFile: base64Files[0],
      saPassportNumber: formData.saPassportNumber || null,
      saPassportDocumentFile: base64Files[1],
      foreignPassportNumber: formData.foreignPassportNumber || null,
      foreignPassportDocumentFile: base64Files[2],
      driversLicenceNumber: formData.driversLicenceNumber || null,
      driversLicenceFile: base64Files[3],
      companyName: formData.companyName || null,
      companyRegistrationNumber: formData.companyRegistrationNumber || null,
      companyRegistrationDocumentFile: base64Files[4],
      tradeName: formData.tradeName || null,
      businessType: formData.businessType || null,
      companyMemorandumOfUnderstanding: formData.companyMemorandumOfUnderstanding || false,
      companyMemorandumOfUnderstandingFile: base64Files[5],
      companyCertificateOfIncorporation: formData.companyCertificateOfIncorporation || false,
      companyCertificateOfIncorporationFile: base64Files[6],
      companyFoundingStatement: formData.companyFoundingStatement || false,
      companyFoundingStatementFile: base64Files[7],
      incomeTaxNumber: formData.incomeTaxNumber || null,
      taxClearanceCertificateFile: base64Files[8],
      postalAddressStreet: formData.postalAddressStreet || '',
      postalAddressSuburb: formData.postalAddressSuburb || '',
      postalAddressCity: formData.postalAddressCity || '',
      postalCode: formData.postalCode || '',
      domiciliumCitandi: formData.domiciliumCitandi || '',
      isStreetAddressSameAsPostal: formData.isStreetAddressSameAsPostal || false,
      streetAddressStreet: formData.streetAddressStreet || '',
      streetAddressSuburb: formData.streetAddressSuburb || '',
      streetAddressCity: formData.streetAddressCity || '',
      streetPostalCode: formData.streetPostalCode || '',
      telephoneCode: formData.telephoneCode || '+27',
      telephoneNumber: formData.telephoneNumber || '',
      emailAddress: formData.emailAddress || '',
    };
  
    try {
      // Get Firebase token
      const user = auth.currentUser;
      if (!user) {
        console.error("User not authenticated.");
        return;
      }
  
      const token = await user.getIdToken();
  
      // Submit to API route
      const response = await fetch('/api/submit-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(applicationData),
      });
  
      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        const errorText = contentType?.includes("application/json")
          ? await response.json()
          : await response.text();
        console.error("Submission failed:", errorText);
        return;
      }
  
      const result = await response.json();
      console.log('Submission successful:', result);
      // Optionally reset form or show a success toast
  
    } catch (error) {
      console.error('An error occurred during submission:', error);
    }
  };*/
  
  //-------------------------------------------

  /*const handleSubmit = async () => {

    // Collect all form data
    const applicationData: ApplicationFormData = {
      ...(formData as any), // Type assertion might be needed depending on exact ApplicationFormData type
      // Ensure optional fields that are empty strings or null are explicitly included
      applicationIdDisplay: formData.applicationIdDisplay || null,
      applicationType: formData.applicationType,
      serviceType: formData.serviceType,
      applyingAs: formData.applyingAs,
      amendmentType: formData.amendmentType || null, // Use null for optional string fields
      appCompany: formData.appCompany || null, // Use null for optional string fields
      identificationType: formData.identificationType || null, // Use null for optional string fields
      fullName: formData.fullName || null, // Use null for optional string fields
      saIdNumber: formData.saIdNumber || null, // Use null for optional string fields
      saIdDocumentFile: formData.saIdDocumentFile || null, // Keep as null for File or null
      saPassportNumber: formData.saPassportNumber || null, // Use null for optional string fields
      saPassportDocumentFile: formData.saPassportDocumentFile || null, // Keep as null for File or null
      foreignPassportNumber: formData.foreignPassportNumber || null, // Use null for optional string fields
      foreignPassportDocumentFile: formData.foreignPassportDocumentFile || null, // Keep as null for File or null
      driversLicenceNumber: formData.driversLicenceNumber || null, // Use null for optional string fields
      driversLicenceFile: formData.driversLicenceFile || null, // Keep as null for File or null
      companyName: formData.companyName || null, // Use null for optional string fields
      companyRegistrationNumber: formData.companyRegistrationNumber || null, // Use null for optional string fields
      companyRegistrationDocumentFile: formData.companyRegistrationDocumentFile || null, // Keep as null for File or null
      tradeName: formData.tradeName || null, // Use null for optional string fields
      businessType: formData.businessType || null, // Use null for optional string fields
 companyMemorandumOfUnderstanding: formData.companyMemorandumOfUnderstanding || false, // Use false for optional boolean fields
      companyMemorandumOfUnderstandingFile: formData.companyMemorandumOfUnderstandingFile || null, // Keep as null for File or null
 companyCertificateOfIncorporation: formData.companyCertificateOfIncorporation || false, // Use false for optional boolean fields
      companyCertificateOfIncorporationFile: formData.companyCertificateOfIncorporationFile || null, // Keep as null for File or null
 companyFoundingStatement: formData.companyFoundingStatement || false, // Use false for optional boolean fields
      companyFoundingStatementFile: formData.companyFoundingStatementFile || null, // Keep as null for File or null
      incomeTaxNumber: formData.incomeTaxNumber || null, // Use null for optional string fields
      taxClearanceCertificateFile: formData.taxClearanceCertificateFile || null, // Keep as null for File or null
      postalAddressStreet: formData.postalAddressStreet || '', // Use empty string for optional string fields
      postalAddressSuburb: formData.postalAddressSuburb || '', // Use empty string for optional string fields
      postalAddressCity: formData.postalAddressCity || '', // Use empty string for optional string fields
      postalCode: formData.postalCode || '', // Use empty string for optional string fields
      domiciliumCitandi: formData.domiciliumCitandi || '', // Use empty string for optional string fields
 isStreetAddressSameAsPostal: formData.isStreetAddressSameAsPostal || false, // Use false for optional boolean fields
      streetAddressStreet: formData.streetAddressStreet || '', // Use empty string for optional string fields
      streetAddressSuburb: formData.streetAddressSuburb || '', // Use empty string for optional string fields
      streetAddressCity: formData.streetAddressCity || '', // Use empty string for optional string fields
      streetPostalCode: formData.streetPostalCode || '', // Use empty string for optional string fields
      telephoneCode: formData.telephoneCode || '+27', // Use default or empty string for optional string fields
      telephoneNumber: formData.telephoneNumber || '', // Use empty string for optional string fields
      emailAddress: formData.emailAddress || '', // Use empty string for optional string fields
    };

    try {
        // Get the user's token
        const user = auth.currentUser;
        
        if (!user) {
          // Handle the case where the user is not authenticated
          console.error("User not authenticated.");
          return;
        }
        const token = await user.getIdToken();
    
        // Send the form data and token to your API endpoint
        const response = await fetch('/api/submit-application', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
          },
          body: JSON.stringify(applicationData),
        });
    
        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            const errorText = contentType?.includes("application/json")
              ? await response.json()
              : await response.text(); // fallback for HTML error
          
            console.error("Submission failed:", errorText);
            return;
          }
          
    
        // Handle successful submission
        const result = await response.json();
        console.log('Submission successful:', result);
        // Optionally, redirect the user or show a success message
    
      } catch (error) {
        console.error('An error occurred during submission:', error);
        // Optionally, show an error message to the user
      }

    //---------------------------------------Code for UI part----------------------
    if (!formData.applicationIdDisplay) {
      const newApplicationId = `PW-${String(Date.now()).slice(-4)}-${Math.floor(Math.random() * 100)}`;
      applicationData.applicationIdDisplay = newApplicationId;
      setFormData(prev => ({ ...prev, applicationIdDisplay: newApplicationId })); // Update local state for display
    }

    
  };*/

  

  const isLastDisplayTab = activeTabId === formSectionsConfig[formSectionsConfig.length - 1].id;

  const breadcrumbItems = [
    { label: 'Permits', href: '/applications' },
    { label: 'New' }
  ];

  const isServiceTypeDisabled = !formData.applicationType;
  const isApplyingAsDisabled = isServiceTypeDisabled || !formData.serviceType;
  const isAffiliatedWithDisabled = isApplyingAsDisabled || formData.applyingAs !== 'individual' && formData.applyingAs !== 'company' || !formData.applyingAs;
  
  const isIdentificationTypeDisabled =
    !formData.applicationType ||
    !formData.serviceType ||
    formData.applyingAs !== 'individual' ||
    (formData.serviceType === 'e-hailing' && !formData.appCompany);

  let identificationTypeHelperText = '';
  if (isIdentificationTypeDisabled && formData.applyingAs === 'individual') {
    if (!formData.applicationType) identificationTypeHelperText = 'Please select Application Type first.';
    else if (!formData.serviceType) identificationTypeHelperText = 'Please select Service Type first.';
    else if (!formData.applyingAs) identificationTypeHelperText = 'Please select Applying As first.';
    else if (formData.serviceType === 'e-hailing' && !formData.appCompany) identificationTypeHelperText = 'Please select Affiliated With first.';
    else if (!formData.identificationType && formData.applyingAs === 'individual') identificationTypeHelperText = 'Please select an Identification Type.';
  }
  
  const showCompanyDetails =
    formData.applicationType &&
    formData.serviceType &&
    formData.applyingAs === 'company';

  const individualPrerequisitesMet =
    !!formData.applicationType &&
    !!formData.serviceType &&
    formData.applyingAs === 'individual' &&
    (formData.serviceType !== 'e-hailing' || (formData.serviceType === 'e-hailing' && !!formData.appCompany)) &&
    !!formData.identificationType;

  const showTaxData =
    (individualPrerequisitesMet && formData.identificationType === 'sa_id') ||
    (showCompanyDetails && !!formData.applicationType && !!formData.serviceType && !!formData.applyingAs);


  return (
    <>
      <Breadcrumb items={breadcrumbItems} className="mb-6" />

      <Tabs value={activeTabId} onValueChange={setActiveTabId} className="w-full">
        <ScrollArea className="pb-2 mb-4 border-b flex flex-row">
          <TabsList className="inline-flex h-auto items-center justify-start rounded-none bg-transparent p-0 text-muted-foreground gap-1">
            {formSectionsConfig.map((tab) => {
              const Icon = tab.IconComponent;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-t-md px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-primary ${activeTabId !== tab.id ? 'hover:text-primary/80' : ''}`}
                >
                  {Icon && <Icon className="mr-2 h-4 w-4" />}
                  {tab.title}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </ScrollArea>

        <TabsContent value="applicantData">
            <Card>
              <CardContent className="p-4 space-y-6">
                <fieldset className="space-y-4 border p-4 rounded-md bg-background/50">
                    <legend className="text-lg font-semibold px-1">Header</legend>
                    
                    <div className={`grid ${formData.applicationIdDisplay ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-x-6 gap-y-4`}>
                        <div className="space-y-2">
                            <Label htmlFor="applicationDateDisplay" className="text-base font-semibold">Date:</Label>
                            <Input id="applicationDateDisplay" value={displayDate || ''} readOnly className="cursor-default"/>
                        </div>
                        {formData.applicationIdDisplay && (
                            <div className="space-y-2">
                                <Label htmlFor="applicationIdDisplayValue" className="text-base font-semibold">Application ID:</Label>
                                <Input id="applicationIdDisplayValue" value={formData.applicationIdDisplay} readOnly className="cursor-default" />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="applicationTypeSelect" className="text-base font-semibold">Application Type <span className="text-destructive">*</span></Label>
                            <Select
                                value={formData.applicationType}
                                onValueChange={handleApplicationTypeChange}
                                disabled={isApplicationTypePreSelected}
                            >
                                <SelectTrigger id="applicationTypeSelect">
                                    <SelectValue placeholder="-- Select application type --" />
                                </SelectTrigger>
                                <SelectContent>
                                    {applicationTypeOptions.map(opt => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="serviceTypeSelect" className="text-base font-semibold">Service Type <span className="text-destructive">*</span></Label>
                            <Select
                                value={formData.serviceType || ''}
                                onValueChange={(value) => handleInputChange('serviceType', value)}
                                disabled={isServiceTypeDisabled}
                            >
                                <SelectTrigger id="serviceTypeSelect">
                                    <SelectValue placeholder="-- Select from the list --" />
                                </SelectTrigger>
                                <SelectContent>
                                    {serviceTypeOptions.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {isServiceTypeDisabled && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    Please select an Application Type first.
                                </p>
                            )}
                        </div>
                    </div>

                    {formData.applicationType === 'Route Amendment' && (
                        <div className="space-y-2">
                            <Label htmlFor="amendmentType" className="text-base font-semibold">Amendment Type <span className="text-destructive">*</span></Label>
                            <Select
                                value={formData.amendmentType}
                                onValueChange={handleAmendmentTypeChange}
                                disabled={!formData.applicationType}
                            >
                                <SelectTrigger id="amendmentType">
                                <SelectValue placeholder="-- Select from the list --" />
                                </SelectTrigger>
                                <SelectContent>
                                {amendmentOptions.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    
                    <div className={`grid ${formData.serviceType === 'e-hailing' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-x-6 gap-y-4`}>
                        <div className="space-y-2">
                            <Label htmlFor="applyingAsSelect" className="text-base font-semibold">Applying As: <span className="text-destructive">*</span></Label>
                            <Select
                                value={formData.applyingAs}
                                onValueChange={(value) => handleInputChange('applyingAs', value as 'individual' | 'company' | '')}
                                disabled={isApplyingAsDisabled}
                            >
                                <SelectTrigger id="applyingAsSelect">
                                    <SelectValue placeholder="-- Select from the list --" />
                                </SelectTrigger>
                                <SelectContent>
                                    {applicantScopeOptions.map(opt => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                             {isApplyingAsDisabled && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    Please select a Service Type first.
                                </p>
                            )}
                        </div>
                        {formData.serviceType === 'e-hailing' && (
                            <div className="space-y-2">
                                <Label htmlFor="appCompanySelect" className="text-base font-semibold">Affiliated With <span className="text-destructive">*</span></Label>
                                <Select
                                    value={formData.appCompany || ''}
                                    onValueChange={(value) => handleInputChange('appCompany', value)}
                                    disabled={isAffiliatedWithDisabled}
                                >
                                    <SelectTrigger id="appCompanySelect">
                                        <SelectValue placeholder="-- Select affiliate --" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {appCompanyOptions.map(opt => (
                                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {isAffiliatedWithDisabled && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Please select Applying As first.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>


                    {formData.applyingAs === 'individual' && formData.applicationType && formData.serviceType &&
                        (formData.serviceType !== 'e-hailing' || (formData.serviceType === 'e-hailing' && !!formData.appCompany)) && (
                        <div className="space-y-2">
                            <Label htmlFor="identificationType" className="text-base font-semibold">Identification Type <span className="text-destructive">*</span></Label>
                            <Select
                                value={formData.identificationType || ''}
                                onValueChange={(value) => handleInputChange('identificationType', value as 'sa_id' | 'sa_passport' | 'foreign_passport')}
                                disabled={isIdentificationTypeDisabled}
                            >
                                <SelectTrigger id="identificationType">
                                <SelectValue placeholder="-- Select from the list --" />
                                </SelectTrigger>
                                <SelectContent>
                                    {individualIdentificationOptions.map(opt => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {isIdentificationTypeDisabled && identificationTypeHelperText && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    {identificationTypeHelperText}
                                </p>
                            )}
                        </div>
                    )}

                     {formData.applyingAs === 'company' && formData.applicationType && formData.serviceType && (
                        <div className="space-y-2">
                            <Label className="text-base font-semibold">Company Documents <span className="text-destructive">*</span></Label>
                            <div className="space-y-3 pt-1">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="companyMemorandumOfUnderstanding"
                                        checked={!!formData.companyMemorandumOfUnderstanding}
                                        onCheckedChange={(checked) => handleInputChange('companyMemorandumOfUnderstanding', !!checked)}
                                    />
                                    <Label htmlFor="companyMemorandumOfUnderstanding" className="font-normal text-sm">Memorandum of Understanding</Label>
                                </div>
                                {formData.companyMemorandumOfUnderstanding && (
                                    <div className="space-y-1 ml-6">
                                        <Label htmlFor="companyMemorandumOfUnderstandingFile" className="text-xs">Upload Memorandum <span className="text-destructive">*</span></Label>
                                        <Input id="companyMemorandumOfUnderstandingFile" type="file" onChange={(e) => handleInputChange('companyMemorandumOfUnderstandingFile', e.target.files ? e.target.files[0] : null)} accept=".pdf,.jpg,.jpeg,.png" />
                                        {formData.companyMemorandumOfUnderstandingFile && <p className="text-xs text-muted-foreground mt-1">Selected: {formData.companyMemorandumOfUnderstandingFile.name}</p>}
                                    </div>
                                )}
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="companyCertificateOfIncorporation"
                                        checked={!!formData.companyCertificateOfIncorporation}
                                        onCheckedChange={(checked) => handleInputChange('companyCertificateOfIncorporation', !!checked)}
                                    />
                                    <Label htmlFor="companyCertificateOfIncorporation" className="font-normal text-sm">Certificate of Incorporation</Label>
                                </div>
                                {formData.companyCertificateOfIncorporation && (
                                    <div className="space-y-1 ml-6">
                                        <Label htmlFor="companyCertificateOfIncorporationFile" className="text-xs">Upload Certificate <span className="text-destructive">*</span></Label>
                                        <Input id="companyCertificateOfIncorporationFile" type="file" onChange={(e) => handleInputChange('companyCertificateOfIncorporationFile', e.target.files ? e.target.files[0] : null)} accept=".pdf,.jpg,.jpeg,.png" />
                                        {formData.companyCertificateOfIncorporationFile && <p className="text-xs text-muted-foreground mt-1">Selected: {formData.companyCertificateOfIncorporationFile.name}</p>}
                                    </div>
                                )}
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="companyFoundingStatement"
                                        checked={!!formData.companyFoundingStatement}
                                        onCheckedChange={(checked) => handleInputChange('companyFoundingStatement', !!checked)}
                                    />
                                    <Label htmlFor="companyFoundingStatement" className="font-normal text-sm">Founding Statement</Label>
                                </div>
                                {formData.companyFoundingStatement && (
                                    <div className="space-y-1 ml-6">
                                        <Label htmlFor="companyFoundingStatementFile" className="text-xs">Upload Statement <span className="text-destructive">*</span></Label>
                                        <Input id="companyFoundingStatementFile" type="file" onChange={(e) => handleInputChange('companyFoundingStatementFile', e.target.files ? e.target.files[0] : null)} accept=".pdf,.jpg,.jpeg,.png" />
                                        {formData.companyFoundingStatementFile && <p className="text-xs text-muted-foreground mt-1">Selected: {formData.companyFoundingStatementFile.name}</p>}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </fieldset>

                {individualPrerequisitesMet && formData.identificationType === 'sa_id' && (
                    <fieldset className="space-y-4 border p-4 rounded-md bg-background/50">
                        <legend className="text-lg font-semibold px-1">Identity Data</legend>
                        <div className="space-y-2">
                            <Label htmlFor="fullName" className="text-base font-semibold">Full Name <span className="text-destructive">*</span></Label>
                            <Input id="fullName" value={formData.fullName || ''} onChange={(e) => handleInputChange('fullName', e.target.value)} placeholder="Enter full name" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 items-end">
                            <div className="space-y-2">
                            <Label htmlFor="saIdNumber" className="text-base font-semibold">SA ID Number <span className="text-destructive">*</span></Label>
                            <Input id="saIdNumber" value={formData.saIdNumber || ''} onChange={(e) => handleInputChange('saIdNumber', e.target.value)} placeholder="Enter SA ID Number" />
                            </div>
                            <div className="space-y-2">
                            <Label htmlFor="saIdDocumentFile" className="text-base font-semibold">Upload Certified SA ID Copy <span className="text-destructive">*</span></Label>
                            <Input
                                id="saIdDocumentFile"
                                type="file"
                                onChange={(e) => handleInputChange('saIdDocumentFile', e.target.files ? e.target.files[0] : null)}
                                accept=".pdf,.jpg,.jpeg,.png"
                            />
                            {formData.saIdDocumentFile && <p className="text-xs text-muted-foreground mt-1">Selected: {formData.saIdDocumentFile.name}</p>}
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 items-end">
                        <div className="space-y-2">
                            <Label htmlFor="driversLicenceNumber" className="text-base font-semibold">Driver's Licence Number <span className="text-destructive">*</span></Label>
                            <Input id="driversLicenceNumber" value={formData.driversLicenceNumber || ''} onChange={(e) => handleInputChange('driversLicenceNumber', e.target.value)} placeholder="Enter driver's licence number" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="driversLicenceFile" className="text-base font-semibold">Upload Driver's licence with Pdp <span className="text-destructive">*</span></Label>
                            <Input
                            id="driversLicenceFile"
                            type="file"
                            onChange={(e) => handleInputChange('driversLicenceFile', e.target.files ? e.target.files[0] : null)}
                            accept=".pdf,.jpg,.jpeg,.png"
                            />
                            {formData.driversLicenceFile && <p className="text-xs text-muted-foreground mt-1">Selected: {formData.driversLicenceFile.name}</p>}
                        </div>
                        </div>
                    </fieldset>
                )}
                {individualPrerequisitesMet && formData.identificationType === 'sa_passport' && (
                    <fieldset className="space-y-4 border p-4 rounded-md bg-background/50">
                        <legend className="text-lg font-semibold px-1">Identity Data (SA Passport)</legend>
                         <div className="space-y-2">
                            <Label htmlFor="fullNamePassport" className="text-base font-semibold">Full Name <span className="text-destructive">*</span></Label>
                            <Input id="fullNamePassport" value={formData.fullName || ''} onChange={(e) => handleInputChange('fullName', e.target.value)} placeholder="Enter full name" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 items-end">
                            <div className="space-y-2">
                            <Label htmlFor="saPassportNumber" className="text-base font-semibold">SA Passport Number <span className="text-destructive">*</span></Label>
                            <Input id="saPassportNumber" value={formData.saPassportNumber || ''} onChange={(e) => handleInputChange('saPassportNumber', e.target.value)} placeholder="Enter SA Passport Number" />
                            </div>
                            <div className="space-y-2">
                            <Label htmlFor="saPassportDocumentFile" className="text-base font-semibold">Upload Certified SA Passport Copy <span className="text-destructive">*</span></Label>
                            <Input
                                id="saPassportDocumentFile"
                                type="file"
                                onChange={(e) => handleInputChange('saPassportDocumentFile', e.target.files ? e.target.files[0] : null)}
                                accept=".pdf,.jpg,.jpeg,.png"
                            />
                            {formData.saPassportDocumentFile && <p className="text-xs text-muted-foreground mt-1">Selected: {formData.saPassportDocumentFile.name}</p>}
                            </div>
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 items-end">
                            <div className="space-y-2">
                                <Label htmlFor="driversLicenceNumberPassport" className="text-base font-semibold">Driver's Licence Number <span className="text-destructive">*</span></Label>
                                <Input id="driversLicenceNumberPassport" value={formData.driversLicenceNumber || ''} onChange={(e) => handleInputChange('driversLicenceNumber', e.target.value)} placeholder="Enter driver's licence number" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="driversLicenceFilePassport" className="text-base font-semibold">Upload Driver's licence with Pdp <span className="text-destructive">*</span></Label>
                                <Input id="driversLicenceFilePassport" type="file" onChange={(e) => handleInputChange('driversLicenceFile', e.target.files ? e.target.files[0] : null)} accept=".pdf,.jpg,.jpeg,.png"/>
                                {formData.driversLicenceFile && <p className="text-xs text-muted-foreground mt-1">Selected: {formData.driversLicenceFile.name}</p>}
                            </div>
                        </div>
                    </fieldset>
                )}
                {individualPrerequisitesMet && formData.identificationType === 'foreign_passport' && (
                     <fieldset className="space-y-4 border p-4 rounded-md bg-background/50">
                        <legend className="text-lg font-semibold px-1">Identity Data (Foreign Passport)</legend>
                         <div className="space-y-2">
                            <Label htmlFor="fullNameForeignPassport" className="text-base font-semibold">Full Name <span className="text-destructive">*</span></Label>
                            <Input id="fullNameForeignPassport" value={formData.fullName || ''} onChange={(e) => handleInputChange('fullName', e.target.value)} placeholder="Enter full name" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 items-end">
                            <div className="space-y-2">
                            <Label htmlFor="foreignPassportNumber" className="text-base font-semibold">Foreign Passport Number <span className="text-destructive">*</span></Label>
                            <Input id="foreignPassportNumber" value={formData.foreignPassportNumber || ''} onChange={(e) => handleInputChange('foreignPassportNumber', e.target.value)} placeholder="Enter Foreign Passport Number" />
                            </div>
                            <div className="space-y-2">
                            <Label htmlFor="foreignPassportDocumentFile" className="text-base font-semibold">Upload Certified Foreign Passport Copy <span className="text-destructive">*</span></Label>
                            <Input
                                id="foreignPassportDocumentFile"
                                type="file"
                                onChange={(e) => handleInputChange('foreignPassportDocumentFile', e.target.files ? e.target.files[0] : null)}
                                accept=".pdf,.jpg,.jpeg,.png"
                            />
                            {formData.foreignPassportDocumentFile && <p className="text-xs text-muted-foreground mt-1">Selected: {formData.foreignPassportDocumentFile.name}</p>}
                            </div>
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 items-end">
                            <div className="space-y-2">
                                <Label htmlFor="driversLicenceNumberForeign" className="text-base font-semibold">Driver's Licence Number <span className="text-destructive">*</span></Label>
                                <Input id="driversLicenceNumberForeign" value={formData.driversLicenceNumber || ''} onChange={(e) => handleInputChange('driversLicenceNumber', e.target.value)} placeholder="Enter driver's licence number" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="driversLicenceFileForeign" className="text-base font-semibold">Upload Driver's licence with Pdp <span className="text-destructive">*</span></Label>
                                <Input id="driversLicenceFileForeign" type="file" onChange={(e) => handleInputChange('driversLicenceFile', e.target.files ? e.target.files[0] : null)} accept=".pdf,.jpg,.jpeg,.png"/>
                                {formData.driversLicenceFile && <p className="text-xs text-muted-foreground mt-1">Selected: {formData.driversLicenceFile.name}</p>}
                            </div>
                        </div>
                    </fieldset>
                )}

                { showCompanyDetails && (
                    <fieldset className="space-y-4 border p-4 rounded-md bg-background/50">
                        <legend className="text-lg font-semibold px-1">Company Details</legend>
                        <div className="space-y-2">
                            <Label htmlFor="companyName" className="text-base font-semibold">Company Name / Legal Entity Name <span className="text-destructive">*</span></Label>
                            <Input id="companyName" value={formData.companyName || ''} onChange={(e) => handleInputChange('companyName', e.target.value)} placeholder="e.g., ABC Transport (Pty) Ltd" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 items-end">
                        <div className="space-y-2">
                            <Label htmlFor="companyRegistrationNumber" className="text-base font-semibold">Company Registration Number <span className="text-destructive">*</span></Label>
                            <Input id="companyRegistrationNumber" value={formData.companyRegistrationNumber || ''} onChange={(e) => handleInputChange('companyRegistrationNumber', e.target.value)} placeholder="Enter Company Registration Number" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="companyRegistrationDocumentFile" className="text-base font-semibold">Upload Company Registration Document <span className="text-destructive">*</span></Label>
                            <Input
                            id="companyRegistrationDocumentFile"
                            type="file"
                            onChange={(e) => handleInputChange('companyRegistrationDocumentFile', e.target.files ? e.target.files[0] : null)}
                            accept=".pdf,.jpg,.jpeg,.png"
                            />
                            {formData.companyRegistrationDocumentFile && <p className="text-xs text-muted-foreground mt-1">Selected: {formData.companyRegistrationDocumentFile.name}</p>}
                        </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="tradeNameCompany" className="text-base font-semibold">Trade name (if different from registered name) <span className="text-destructive">*</span></Label>
                            <Input id="tradeNameCompany" value={formData.tradeName || ''} onChange={(e) => handleInputChange('tradeName', e.target.value)} placeholder="e.g., Speedy Deliveries" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="businessTypeCompany" className="text-base font-semibold">Type of business <span className="text-destructive">*</span></Label>
                            <Input id="businessTypeCompany" value={formData.businessType || ''} onChange={(e) => handleInputChange('businessType', e.target.value)} placeholder="e.g., Passenger Transport, Logistics" />
                        </div>
                        </div>
                    </fieldset>
                )}

                { showTaxData && (
                    <fieldset className="space-y-4 border p-4 rounded-md bg-background/50">
                        <legend className="text-lg font-semibold px-1">Tax Data</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 items-end">
                            <div className="space-y-2">
                            <Label htmlFor="incomeTaxNumber" className="text-base font-semibold">Income Tax Registration Number <span className="text-destructive">*</span></Label>
                            <Input id="incomeTaxNumber" value={formData.incomeTaxNumber || ''} onChange={(e) => handleInputChange('incomeTaxNumber', e.target.value)} placeholder="Enter income tax registration number" />
                            </div>
                            <div className="space-y-2">
                            <Label htmlFor="taxClearanceCertificateFile" className="text-base font-semibold">Upload Tax Clearance Certificate <span className="text-destructive">*</span></Label>
                            <Input
                                id="taxClearanceCertificateFile"
                                type="file"
                                onChange={(e) => handleInputChange('taxClearanceCertificateFile', e.target.files ? e.target.files[0] : null)}
                                accept=".pdf,.jpg,.jpeg,.png"
                            />
                            {formData.taxClearanceCertificateFile && (
                                <p className="text-xs text-muted-foreground mt-1">
                                Selected file: {formData.taxClearanceCertificateFile.name}
                                </p>
                            )}
                            </div>
                        </div>
                    </fieldset>
                )}
              </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="addressInfo">
            <Card>
                <CardHeader>
                    <CardTitle>Address Information</CardTitle>
                    <CardDescription>Please provide all relevant address and contact details.</CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-6">
                    {(formData.applicationType && formData.serviceType && (formData.applyingAs === 'individual' || formData.applyingAs === 'company')) && (
                        <fieldset className="space-y-6 border p-4 rounded-md bg-background/50">
                            <legend className="text-lg font-semibold px-1">Contact Information</legend>
                            <fieldset className="space-y-4 border p-4 rounded-md bg-background/50">
                                <legend className="text-sm font-medium px-1">Postal Address <span className="text-destructive">*</span></legend>
                                <div className="space-y-2">
                                <Label htmlFor="postalAddressStreet" className="text-base font-semibold">Street / P.O. Box <span className="text-destructive">*</span></Label>
                                <Input id="postalAddressStreet" value={formData.postalAddressStreet || ''} onChange={(e) => handleInputChange('postalAddressStreet', e.target.value)} placeholder="e.g., P.O. Box 123 or 123 Main St" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="postalAddressSuburb" className="text-base font-semibold">Suburb / District <span className="text-destructive">*</span></Label>
                                    <Select value={formData.postalAddressSuburb || ''} onValueChange={(value) => handleInputChange('postalAddressSuburb', value)}>
                                    <SelectTrigger id="postalAddressSuburb"><SelectValue placeholder="-- Select from the list --" /></SelectTrigger>
                                    <SelectContent>
                                        {suburbOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                    </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="postalAddressCity" className="text-base font-semibold">City / Town <span className="text-destructive">*</span></Label>
                                    <Select value={formData.postalAddressCity || ''} onValueChange={(value) => handleInputChange('postalAddressCity', value)}>
                                    <SelectTrigger id="postalAddressCity"><SelectValue placeholder="-- Select from the list --" /></SelectTrigger>
                                    <SelectContent>
                                        {cityOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                    </SelectContent>
                                    </Select>
                                </div>
                                </div>
                                <div className="space-y-2">
                                <Label htmlFor="postalCode" className="text-base font-semibold">Postal code <span className="text-destructive">*</span></Label>
                                <Input id="postalCode" value={formData.postalCode || ''} onChange={(e) => handleInputChange('postalCode', e.target.value)} placeholder="e.g., 0001" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="domiciliumCitandi" className="text-base font-semibold">Domicilium citandi et executandi (address for legal notices) <span className="text-destructive">*</span></Label>
                                    <Textarea id="domiciliumCitandi" value={formData.domiciliumCitandi || ''} onChange={(e) => handleInputChange('domiciliumCitandi', e.target.value)} placeholder="Enter the legal address for service of documents" />
                                </div>
                            </fieldset>

                            <div className="flex items-center space-x-2 mt-4 mb-2">
                                <Checkbox
                                id="isStreetAddressSameAsPostal"
                                checked={!!formData.isStreetAddressSameAsPostal}
                                onCheckedChange={(checked) => handleInputChange('isStreetAddressSameAsPostal', !!checked)}
                                />
                                <Label htmlFor="isStreetAddressSameAsPostal" className="text-sm font-medium">Street address is the same as postal address <span className="text-destructive">*</span></Label>
                            </div>

                            {!formData.isStreetAddressSameAsPostal && (
                                <fieldset className="space-y-4 border p-4 rounded-md bg-background/50">
                                <legend className="text-sm font-medium px-1">Street Address <span className="text-destructive">*</span></legend>
                                <div className="space-y-2">
                                    <Label htmlFor="streetAddressStreet" className="text-base font-semibold">Street <span className="text-destructive">*</span></Label>
                                    <Input id="streetAddressStreet" value={formData.streetAddressStreet || ''} onChange={(e) => handleInputChange('streetAddressStreet', e.target.value)} placeholder="e.g., 456 Oak Avenue" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                    <Label htmlFor="streetAddressSuburb" className="text-base font-semibold">Suburb / District <span className="text-destructive">*</span></Label>
                                    <Select value={formData.streetAddressSuburb || ''} onValueChange={(value) => handleInputChange('streetAddressSuburb', value)}>
                                        <SelectTrigger id="streetAddressSuburb"><SelectValue placeholder="-- Select from the list --" /></SelectTrigger>
                                        <SelectContent>
                                            {suburbOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    </div>
                                    <div className="space-y-2">
                                    <Label htmlFor="streetAddressCity" className="text-base font-semibold">City / Town <span className="text-destructive">*</span></Label>
                                    <Select value={formData.streetAddressCity || ''} onValueChange={(value) => handleInputChange('streetAddressCity', value)}>
                                        <SelectTrigger id="streetAddressCity"><SelectValue placeholder="-- Select from the list --" /></SelectTrigger>
                                        <SelectContent>
                                            {cityOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="streetPostalCode" className="text-base font-semibold">Postal code <span className="text-destructive">*</span></Label>
                                    <Input id="streetPostalCode" value={formData.streetPostalCode || ''} onChange={(e) => handleInputChange('streetPostalCode', e.target.value)} placeholder="e.g., 0002" />
                                </div>
                                </fieldset>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="telephoneNumber" className="text-base font-semibold">Mobile number <span className="text-destructive">*</span></Label>
                                    <div className="flex gap-2">
                                    <Input
                                        id="telephoneCode"
                                        value={formData.telephoneCode || ''}
                                        onChange={(e) => handleInputChange('telephoneCode', e.target.value)}
                                        placeholder="+27"
                                        className="w-1/3"
                                    />
                                    <Input
                                        id="telephoneNumber"
                                        type="tel"
                                        value={formData.telephoneNumber || ''}
                                        onChange={(e) => {
                                        let numericValue = e.target.value.replace(/[^0-9]/g, '');
                                        if (formData.telephoneCode === '+27' && numericValue.startsWith('0')) {
                                            numericValue = numericValue.substring(1);
                                        }
                                        handleInputChange('telephoneNumber', numericValue);
                                        }}
                                        placeholder="e.g. 721234567 (no leading 0)"
                                        className="w-2/3"
                                        title="Enter your 9-digit mobile number without the leading zero (e.g., 721234567)."
                                    />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="emailAddress" className="text-base font-semibold">E-mail address <span className="text-destructive">*</span></Label>
                                    <Input id="emailAddress" type="email" value={formData.emailAddress || ''} onChange={(e) => handleInputChange('emailAddress', e.target.value)} placeholder="e.g., example@yourcompany.com" />
                                </div>
                            </div>
                        </fieldset>
                    )}
                     { !(formData.applicationType && formData.serviceType && (formData.applyingAs === 'individual' || formData.applyingAs === 'company')) && (
                        <p className="text-muted-foreground">Please complete Application Type, Service Type, and Applying As in the 'Applicant Data' tab first to fill in address information.</p>
                    )}
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="documentation">
             <Card>
              <CardHeader>
                <CardTitle>Documentation</CardTitle>
                <CardDescription>Upload additional supporting documents and annexures.</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-muted-foreground">Content for Documentation will be implemented here. This section is for any additional annexures required for the application.</p>
                 <div className="mt-4 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="field-doc-1" className="text-base font-semibold">Sample Annexure Field 1 <span className="text-destructive">*</span></Label>
                        <Input id="field-doc-1" type="file" />
                    </div>
                </div>
              </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="vehicleData">
        <Card>
        <CardHeader>
                <CardTitle>Vehicle</CardTitle>
                <CardDescription>Please provide all relevant vehicle details</CardDescription>
              </CardHeader>
        <CardContent className="p-4">
  <div className="mt-4 space-y-4">

    {/* Vehicle Registration Number */}
    <div className="space-y-2">
      <Label htmlFor="vehicleRegistration" className="text-base font-semibold">
        Vehicle Registration Number <span className="text-destructive">*</span>
      </Label>
      <Input
        id="vehicleRegistration"
        value={formData.vehicleRegistrationNumber|| ""}
        onChange={(e) => handleInputChange("vehicleRegistrationNumber", e.target.value)}
        placeholder="Enter vehicle registration"
      />
    </div>

    {/* Vehicle Type */}
    <div className="space-y-2">
      <Label htmlFor="vehicleType" className="text-base font-semibold">
        Vehicle Type <span className="text-destructive">*</span>
      </Label>
      <select
        id="vehicleType"
        value={formData.vehicleType || ""}
        onChange={(e) => handleInputChange("vehicleType", e.target.value)}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      >
        <option value="">Select vehicle type</option>
        <option value="sedan">Sedan</option>
        <option value="minibus">Minibus</option>
        <option value="shuttle">Shuttle</option>
        <option value="bus">Bus</option>
        <option value="bakkie">Bakkie</option>
      </select>
    </div>

    {/* Vehicle Make */}
    <div className="space-y-2">
      <Label htmlFor="vehicleMake" className="text-base font-semibold">
        Vehicle Make <span className="text-destructive">*</span>
      </Label>
      <Input
        id="vehicleMake"
        value={formData.vehicleMake || ""}
        onChange={(e) => handleInputChange("vehicleMake", e.target.value)}
        placeholder="e.g., Toyota, Mercedes-Benz"
      />
    </div>

    {/* Vehicle Model */}
    <div className="space-y-2">
      <Label htmlFor="vehicleModel" className="text-base font-semibold">
        Vehicle Model <span className="text-destructive">*</span>
      </Label>
      <Input
        id="vehicleModel"
        value={formData.vehicleModel || ""}
        onChange={(e) => handleInputChange("vehicleModel", e.target.value)}
        placeholder="e.g., Quantum, Sprinter"
      />
    </div>

    {/* Year of Manufacture */}
    <div className="space-y-2">
      <Label htmlFor="vehicleYear" className="text-base font-semibold">
        Year of Manufacture <span className="text-destructive">*</span>
      </Label>
      <Input
        id="vehicleYear"
        type="number"
        value={formData.vehicleYear || ""}
        onChange={(e) => handleInputChange("vehicleYear", e.target.value)}
        placeholder="Enter year"
      />
    </div>

    {/* VIN / Chassis Number */}
    <div className="space-y-2">
      <Label htmlFor="vehicleVin" className="text-base font-semibold">
        VIN / Chassis Number <span className="text-destructive">*</span>
      </Label>
      <Input
        id="vehicleVin"
        value={formData.vehicleVIN || ""}
        onChange={(e) => handleInputChange("vehicleVIN", e.target.value)}
        placeholder="Enter VIN / Chassis Number"
      />
    </div>

    {/* Engine Number /}
    <div className="space-y-2">
      <Label htmlFor="vehicleEngine" className="text-base font-semibold">
        Engine Number <span className="text-destructive">*</span>
      </Label>
      <Input
        id="vehicleEngine"
        value={formData.vehicleEngine || ""}
        onChange={(e) => handleInputChange("vehicleEngine", e.target.value)}
        placeholder="Enter engine number"
      />
    </div>*/}

    {/* Passenger Capacity /}
    <div className="space-y-2">
      <Label htmlFor="vehicleCapacity" className="text-base font-semibold">
        Passenger Capacity <span className="text-destructive">*</span>
      </Label>
      <Input
        id="vehicleCapacity"
        type="number"
        value={formData.vehicleCapacity || ""}
        onChange={(e) => handleInputChange("vehicleCapacity", e.target.value)}
        placeholder="Enter passenger capacity"
      />
    </div>*/}

    {/* Vehicle Ownership Document */}
    <div className="space-y-2">
      <Label htmlFor="vehicleOwnershipDocumentFile" className="text-base font-semibold">
        Vehicle Ownership Document <span className="text-destructive">*</span>
      </Label>
      <Input
        id="vehicleOwnershipDocumentFile"
        type="file"
        onChange={(e) =>
          handleInputChange("vehicleOwnershipDocumentFile", e.target.files?.[0] || null)
        }
      />
    </div>

    {/* Vehicle License Disc */}
    <div className="space-y-2">
      <Label htmlFor="vehicleLicenseDiscFile" className="text-base font-semibold">
        Vehicle License Disc <span className="text-destructive">*</span>
      </Label>
      <Input
        id="vehicleLicenseDiscFile"
        type="file"
        onChange={(e) =>
          handleInputChange("vehicleLicenseDiscFile", e.target.files?.[0] || null)
        }
      />
    </div>

  </div>
</CardContent>
</Card>
</TabsContent>


        {/*<TabsContent value="vehicleData">
  <Card>
    <CardHeader>
      <CardTitle>Vehicle Data</CardTitle>
      <CardDescription>
        Provide details about the vehicle(s) to be used for the service.
      </CardDescription>
    </CardHeader>

    <CardContent className="p-4">
      <div className="mt-4 space-y-4">

        {/* Vehicle Registration Number /}
        <div className="space-y-2">
          <Label htmlFor="vehicle-registration" className="text-base font-semibold">
            Vehicle Registration Number <span className="text-destructive">*</span>
          </Label>
          <Input id="vehicle-registration" placeholder="Enter vehicle registration" />
        </div>

        {/* Vehicle Type /}
        <div className="space-y-2">
          <Label htmlFor="vehicle-type" className="text-base font-semibold">
            Vehicle Type <span className="text-destructive">*</span>
          </Label>
          <select
            id="vehicle-type"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Select vehicle type</option>
            <option value="sedan">Sedan</option>
            <option value="minibus">Minibus</option>
            <option value="shuttle">Shuttle</option>
            <option value="bus">Bus</option>
            <option value="bakkie">Bakkie</option>
          </select>
        </div>

        {/* Vehicle Make /}
        <div className="space-y-2">
          <Label htmlFor="vehicle-make" className="text-base font-semibold">
            Vehicle Make <span className="text-destructive">*</span>
          </Label>
          <Input id="vehicle-make" placeholder="e.g., Toyota, Mercedes-Benz" />
        </div>

        {/* Vehicle Model /}
        <div className="space-y-2">
          <Label htmlFor="vehicle-model" className="text-base font-semibold">
            Vehicle Model <span className="text-destructive">*</span>
          </Label>
          <Input id="vehicle-model" placeholder="e.g., Quantum, Sprinter" />
        </div>

        {/* Year of Manufacture /}
        <div className="space-y-2">
          <Label htmlFor="vehicle-year" className="text-base font-semibold">
            Year of Manufacture <span className="text-destructive">*</span>
          </Label>
          <Input id="vehicle-year" type="number" placeholder="Enter year" />
        </div>

        {/* VIN / Chassis Number /}
        <div className="space-y-2">
          <Label htmlFor="vehicle-vin" className="text-base font-semibold">
            VIN / Chassis Number <span className="text-destructive">*</span>
          </Label>
          <Input id="vehicle-vin" placeholder="Enter VIN / Chassis Number" />
        </div>

        {/* Engine Number /}
        <div className="space-y-2">
          <Label htmlFor="vehicle-engine" className="text-base font-semibold">
            Engine Number <span className="text-destructive">*</span>
          </Label>
          <Input id="vehicle-engine" placeholder="Enter engine number" />
        </div>

        {/* Passenger Capacity /}
        <div className="space-y-2">
          <Label htmlFor="vehicle-capacity" className="text-base font-semibold">
            Passenger Capacity <span className="text-destructive">*</span>
          </Label>
          <Input id="vehicle-capacity" type="number" placeholder="Enter passenger capacity" />
        </div>

        {/* Certificate of Roadworthiness /}
        <div className="space-y-2">
          <Label htmlFor="vehicle-roadworthy" className="text-base font-semibold">
            Certificate of Roadworthiness <span className="text-destructive">*</span>
          </Label>
          <Input id="vehicle-roadworthy" type="file" />
        </div>

        {/* Vehicle License Disc /}
        <div className="space-y-2">
          <Label htmlFor="vehicle-disc" className="text-base font-semibold">
            Vehicle License Disc <span className="text-destructive">*</span>
          </Label>
          <Input id="vehicle-disc" type="file" />
        </div>

      </div>
    </CardContent>
  </Card>
</TabsContent>*/}


        {/*<TabsContent value="vehicleData">
             <Card>
              <CardHeader>
                <CardTitle>Vehicle Data</CardTitle>
                <CardDescription>Provide details about the vehicle(s) to be used for the service.</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-muted-foreground">Content for Vehicle Data will be implemented here. This includes vehicle registration, type, capacity, etc.</p>
                 <div className="mt-4 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="field-vehicle-1" className="text-base font-semibold">Vehicle Registration Number <span className="text-destructive">*</span></Label>
                        <Input id="field-vehicle-1" placeholder="Enter vehicle registration" />
                    </div>
                </div>
              </CardContent>
            </Card>
        </TabsContent>*/}

        <TabsContent value="audit">
            <Card>
                <CardHeader>
                    <CardTitle>Audit Trail (Key Information)</CardTitle>
                    <CardDescription>Summary of key application data for review.</CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-3 text-sm">
                     <div>
                        <span className="font-semibold text-foreground">Application Type: </span>
                        <span className="text-muted-foreground">{getDisplayApplicationType(formData.applicationType)}</span>
                    </div>
                     {formData.applicationType === 'amendment' && formData.amendmentType && (
                        <div>
                            <span className="font-semibold text-foreground">Amendment Type: </span>
                            <span className="text-muted-foreground">{amendmentOptions.find(opt => opt.value === formData.amendmentType)?.label || 'N/A'}</span>
                        </div>
                    )}
                    <div>
                        <span className="font-semibold text-foreground">Service Type: </span>
                        <span className="text-muted-foreground">{getDisplayServiceType(formData.serviceType)}</span>
                    </div>
                    <div>
                        <span className="font-semibold text-foreground">Applying As: </span>
                        <span className="text-muted-foreground">{getDisplayApplicantType(formData.applyingAs)}</span>
                    </div>
                     {formData.serviceType === 'e-hailing' && formData.appCompany && (
                        <div>
                            <span className="font-semibold text-foreground">Affiliated With: </span>
                            <span className="text-muted-foreground">{appCompanyOptions.find(opt => opt.value === formData.appCompany)?.label || 'N/A'}</span>
                        </div>
                    )}
                     {formData.applyingAs === 'individual' && formData.identificationType && (
                         <div>
                            <span className="font-semibold text-foreground">Identification Type: </span>
                            <span className="text-muted-foreground">{individualIdentificationOptions.find(opt=> opt.value === formData.identificationType)?.label || 'N/A'}</span>
                        </div>
                    )}
                     <div>
                        <span className="font-semibold text-foreground">Application ID: </span>
                        <span className="text-muted-foreground">{formData.applicationIdDisplay || "PW-XXXX (Generated on Submit)"}</span>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="workflows">
            <Card>
                <CardHeader>
                    <CardTitle>Workflows</CardTitle>
                    <CardDescription>View and manage application workflow status.</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                    <p className="text-muted-foreground">Workflow information for this application will be displayed here.</p>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="notifications">
            <Card>
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>View notifications related to this application.</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                    <p className="text-muted-foreground">Notification history for this application will be displayed here.</p>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="status">
            <Card>
                <CardHeader>
                    <CardTitle>Application Status</CardTitle>
                    <CardDescription>Current status and history of the application.</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                    <p className="text-muted-foreground">The overall status and historical changes for this application will be displayed here.</p>
                </CardContent>
            </Card>
        </TabsContent>

      </Tabs>

      <div className="mt-8 flex justify-between items-center">
        <Button variant="outline" onClick={handleCancelFlow}>
            Cancel
        </Button>
        <div className="flex items-center space-x-2">
          {isLastDisplayTab ? (
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                {/*disabled={!isCurrentTabValid || !isApplicantDataValid(formData) || !isAddressInfoValid(formData) }*/}
              <Icons.check className="mr-2 h-4 w-4" />
              Submit Application
            </Button>
          ) : (
            <Button onClick={goToNextTab} disabled={!isCurrentTabValid}>
              Proceed <Icons.arrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

