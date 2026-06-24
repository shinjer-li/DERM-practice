/*
 * catalog.js — Master Control File
 *
 * Edit THIS file to control what appears on the site.
 * Each disease key MUST EXACTLY MATCH a folder name inside images/.
 * Run `python tools/scan_images.py` from the practice/ root to regenerate the manifest.
 */

const CATALOG = [
{
  id: "dermatology",
  label: "Dermatology",
  icon: "ti-body-scan",
  groups: [
    {
      label: "Inflammatory / Papulosquamous",
      diseases: [
        "Psoriasis",
        "Atopic Dermatitis",
        "Allergic Contact Dermatitis",
        "Lichen Planus",
        "Rosacea",
        "Acne Vulgaris",
        "Hidradenitis Suppurativa (HS)",
        "Ichthyosis Vulgaris",
        "Acanthosis Nigricans"
      ]
    },
    {
      label: "Bullous / Immune-Mediated",
      diseases: [
        "Pemphigus Vulgaris",
        "Bullous Pemphigoid",
        "Dermatitis Herpetiformis",
        "Urticaria",
        "Erythema Multiforme",
        "Erythema Nodosum",
        "Stevens-Johnson syndrome (SJS) and Toxic Epidermal Necrolysis (TEN)",
        "Drug Induced Hypersensitivity Syndrome (DIHS)",
        "Drug-induced Photosensitivity",
        "Polymorphous Light Eruption (PMLE)",
        "Staphylococcal Scalded Skin Syndrome (SSSS)"
      ]
    },
    {
      label: "Bacterial Infections",
      diseases: [
        "Impetigo",
        "Cellulitis",
        "Erysipelas",
        "Necrotizing Fasciitis",
        "Scarlet Fever",
        "Rocky Mountain Spotted Fever (RMSF)",
        "Leprosy"
      ]
    },
    {
      label: "Viral Infections",
      diseases: [
        "Herpes Simplex Virus (HSV)",
        "Varicella Zoster",
        "Human Papilloma Virus (HPV)",
        "Molluscum",
        "Hand Food Mouth Disease (HFMD)",
        "Measles",
        "Rubella",
        "Roseola",
        "Erythema Infectiosum",
        "Mpox"
      ]
    },
    {
      label: "Fungal / Parasitic Infections",
      diseases: [
        "Candida Albicans",
        "Tinea Capitis",
        "Tinea Versicolor",
        "Scabies",
        "Pediculosis",
        "Leishmaniasis"
      ]
    },
    {
      label: "Benign / Premalignant / Malignant",
      diseases: [
        "Actinic Keratosis",
        "Seborrheic Keratosis",
        "Basal Cell Carcinoma (BCC)",
        "Squamous Cell Carcinoma (SCC)",
        "Melanoma",
        "Langerhans cell histiocytosis",
        "Mastocytosis Uticaria Pigmentosa (UP)"
      ]
    },
    {
      label: "HY Histology",
      diseases: [
        "KeratinPearl (SCC)",
        "Pseudohorn Cysts (SK)",
        "Multinucleated Giant Cells (HSV + VZV)"
      ]
    }
  ]
},
{
  id: "heme-onc",
  label: "Heme / Onc",
  icon: "ti-droplet",
  groups: [
    {
      label: "Red Blood Cell Disorders",
      diseases: [
        "Iron Deficiency Anemia",
        "Megaloblastic anemia",
        "Aplastic anemia",
        "Sideroblastic Anemia",
        "Sickle cells",
        "Spherocytes",
        "Target cells",
        "Schistocytes (“helmet” cells)",
        "Dacrocytes (“teardrop cells”)",
        "Degmacytes (“bite cells”)",
        "Echinocytes (“burr cells”)",
        "Basophilic stippling",
        "Howell-Jolly bodies",
        "Heinz bodies",
        "Erythrocytes"
      ]
    },
    {
      label: "White Blood Cells",
      diseases: [
        "Neutrophils",
        "Eosinophil",
        "Basophil",
        "Lymphocytes",
        "Monocytes",
        "Plasma Cell",
        "Mast Cell (Mastocytes)"
      ]
    },
    {
      label: "Acute Leukemias",
      diseases: [
        "Acute Lymphoblastic Leukemia (ALL)",
        "Acute Myeloid Leukemia (AML)",
        "Pseudo-Pelger-Huët anomaly"
      ]
    },
    {
      label: "Chronic Leukemias / Myeloproliferative",
      diseases: [
        "Hairy Cell Leukemia",
        "Polycythemia vera (erythromelalgia)",
        "Essential thrombocythemia"
      ]
    },
    {
      label: "Lymphomas",
      diseases: [
        "Burkitt lymphoma",
        "Primary Central Nervous System (CNS) Lymphoma",
        "Reed Sternberg Cell (Hodgkin Lymphoma)",
        "Sézary Cell"
      ]
    },
    {
      label: "Plasma Cell Disorders",
      diseases: [
        "Multiple Myeloma",
        "Plasma Cell Dyscrasias"
      ]
    },
    {
      label: "Heme-Onc Associated Dermatology",
      diseases: [
        "Langerhans cell histiocytosis",
        "Porphyria cutanea tarda"
      ]
    }
  ]
},
{
  id: "gi",
  label: "GI",
  icon: "ti-stethoscope",
  groups: [
    {
      label: "Oral Cavity & Esophagus",
      diseases: [
        "Aphthous Ulcers",
        "Oral Hairy Leukoplakia",
        "Oral Squamous Cell Carcinoma",
        "Achalasia",
        "Eosinophilic Esophagitis",
        "Esophagitis (Candida)",
        "Esophagitis (CMV)",
        "Esophageal Carcinoma",
        "Zenker's Diverticulum"
      ]
    },
    {
      label: "Stomach & Duodenum",
      diseases: [
        "Stomach",
        "Gastro-Duodenal Junction",
        "Gastric Cancer (Signet ring cells)",
        "Duodenum",
        "Duodenal atresia",
        "Annular pancreas",
        "Pneumoperitoneum"
      ]
    },
    {
      label: "Small Intestine",
      diseases: [
        "Jejunum",
        "Ileum",
        "Celiac disease",
        "Whipple disease (foamy macrophages)",
        "Crohn's Disease",
        "Jejunal and ileal atresia",
        "Intussusception (target sign)",
        "Small Bowel Obstruction"
      ]
    },
    {
      label: "Colon & Rectum",
      diseases: [
        "Ulcerative Colitis",
        "Diverticulosis",
        "Tubular Adenoma",
        "Villous Adenoma",
        "Colorectal Cancer (Apple core sign)",
        "Volvulus (Coffee bean sign)",
        "Hirschsprung Disease",
        "Recto-Anal Junction"
      ]
    },
    {
      label: "Hepatobiliary",
      diseases: [
        "Hepatic Portal Triad",
        "Hepatic Steatosis",
        "Alcoholic Hepatitis (Mallory body)",
        "Alcoholic Cirrhosis",
        "Hemochromatosis",
        "Wilson Disease (Kayser-Fleischer rings)",
        "Alpha-1-Antitrypsin Deficiency",
        "Primary Sclerosing Cholangitis (beading sign)",
        "Cholecystitis"
      ]
    },
    {
      label: "Pancreas",
      diseases: [
        "Acute Pancreatitis",
        "Chronic Pancreatitis",
        "Annular pancreas"
      ]
    },
    {
      label: "High-Yield Histology & Anatomy",
      diseases: [
        "Duodenum",
        "Jejunum",
        "Ileum",
        "Stomach",
        "Esophageal-Gastro Junction",
        "Gastro-Duodenal Junction",
        "Recto-Anal Junction",
        "Esophageal-Gastro Junction",
        "Hepatic Portal Triad"
      ]
    }
  ]
},
{
  id: "fod",
  label: "Foundations of Disease",
  icon: "ti-microscope",
  groups: [
    {
      label: "Cell Injury",
      diseases: [
        "Apoptosis",
        "Necrosis",
        "Fatty Change",
        "Amyloidosis",
        "Hyaline Change"
      ]
    },
    {
      label: "Inflammation",
      diseases: [
        "Acute Inflammation",
        "Chronic Inflammation",
        "Granuloma",
        "Abscess"
      ]
    },
    {
      label: "Repair & Neoplasia",
      diseases: [
        "Wound Healing",
        "Dysplasia",
        "Metaplasia",
        "Carcinoma in Situ"
      ]
    },
    {
      label: "Microbiology",
      diseases: [
        "Gram Positive Cocci",
        "Gram Negative Rods",
        "Fungi",
        "Parasites",
        "Viruses"
      ]
    }
  ]
},
{
  id: "endocrine",
  label: "Endocrine",
  icon: "ti-activity",
  groups: [
    {
      label: "Thyroid",
      diseases: [
        "Graves Disease",
        "Hashimoto Thyroiditis",
        "Papillary Thyroid Carcinoma",
        "Follicular Thyroid Carcinoma",
        "Medullary Thyroid Carcinoma",
        "Multinodular Goiter"
      ]
    },
    {
      label: "Adrenal",
      diseases: [
        "Cushing Syndrome",
        "Addison Disease",
        "Pheochromocytoma",
        "Adrenocortical Carcinoma",
        "Primary Hyperaldosteronism"
      ]
    },
    {
      label: "Pancreas & Other",
      diseases: [
        "Type 1 Diabetes",
        "Type 2 Diabetes",
        "Insulinoma",
        "Acromegaly",
        "Hyperparathyroidism",
        "MEN Syndromes"
      ]
    }
  ]
},
{
  id: "reproductive",
  label: "Reproductive",
  icon: "ti-gender-bigender",
  groups: [
    {
      label: "Female",
      diseases: [
        "Endometriosis",
        "Leiomyoma",
        "Endometrial Carcinoma",
        "Cervical Carcinoma",
        "Ovarian Carcinoma",
        "PCOS",
        "Hydatidiform Mole"
      ]
    },
    {
      label: "Male",
      diseases: [
        "Prostate Carcinoma",
        "Testicular Carcinoma",
        "Seminoma",
        "Embryonal Carcinoma",
        "BPH"
      ]
    },
    {
      label: "Breast",
      diseases: [
        "Ductal Carcinoma in Situ",
        "Invasive Ductal Carcinoma",
        "Lobular Carcinoma",
        "Fibrocystic Change",
        "Fibroadenoma"
      ]
    }
  ]
}
];

if (typeof module !== "undefined") module.exports = CATALOG;
