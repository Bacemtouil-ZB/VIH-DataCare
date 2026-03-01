import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function AntecedentsPage() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 px-10 py-8">
      {/* HEADER */}
      <div className="flex items-start justify-between mb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight">Antécédents</h1>
            <Badge variant="secondary">Version active V3</Badge>
          </div>
          <p className="text-sm text-gray-500">
            Patient : Mohamed Ali — Dernière mise à jour : 23/02/2026 par Dr Ahmed
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline">Historique</Button>
          {isEditing ? (
            <Button onClick={() => setIsEditing(false)}>Enregistrer</Button>
          ) : (
            <Button variant="default" onClick={() => setIsEditing(true)}>
              Modifier
            </Button>
          )}
        </div>
      </div>

      {/* GRID LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* MEDICAL */}
        <SectionCard title="Antécédents Médicaux" isEditing={isEditing}>
          <TwoColumnCheckbox label="Diabète" />
          <TwoColumnCheckbox label="Hypertension" />
          <TwoColumnCheckbox label="Cardiopathies" />
          <TwoColumnCheckbox label="Insuffisance rénale" />
          <TwoColumnCheckbox label="Maladies hépatiques" />
          <TwoColumnCheckbox label="Asthme / BPCO" />
          <TwoColumnCheckbox label="Cancer" />
          <div className="col-span-2">
            <Input placeholder="Autres..." disabled={!isEditing} />
          </div>
        </SectionCard>

        {/* INFECTIOUS */}
        <SectionCard title="Antécédents Infectieux" isEditing={isEditing}>
          <TwoColumnCheckbox label="Tuberculose" />
          <TwoColumnCheckbox label="Hépatites virales" />
          <TwoColumnCheckbox label="Syphilis" />
          <TwoColumnCheckbox label="Gonococcie" />
          <TwoColumnCheckbox label="Chlamydia" />
          <TwoColumnCheckbox label="Zona récidivant" />
        </SectionCard>

        {/* THERAPEUTIC */}
        <SectionCard title="Antécédents Thérapeutiques" isEditing={isEditing}>
          <div className="col-span-2 space-y-4">
            <Input placeholder="Médicaments chroniques" disabled={!isEditing} />
            <Input placeholder="Automédication" disabled={!isEditing} />
            <Input placeholder="Médecines traditionnelles" disabled={!isEditing} />
            <Input placeholder="Allergies médicamenteuses" disabled={!isEditing} />
          </div>
        </SectionCard>

        {/* SURGICAL */}
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Antécédents Chirurgicaux</h2>
              {isEditing && <Button variant="outline">+ Ajouter</Button>}
            </div>

            <div className="space-y-3">
              <SurgicalItem name="Appendicectomie" date="2018" />
              <SurgicalItem name="Pontage coronarien" date="2022" />
            </div>
          </CardContent>
        </Card>

        {/* FAMILY */}
        <SectionCard title="Antécédents Familiaux" isEditing={isEditing}>
          <TwoColumnCheckbox label="Diabète" />
          <TwoColumnCheckbox label="Hypertension" />
          <TwoColumnCheckbox label="Cardiopathies" />
          <TwoColumnCheckbox label="Insuffisance rénale" />
          <TwoColumnCheckbox label="Cancer" />
        </SectionCard>
      </div>
    </div>
  );
}

/* COMPONENTS */

function SectionCard({ title, children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-6">{title}</h2>
          <div className="grid grid-cols-2 gap-4">{children}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function TwoColumnCheckbox({ label }) {
  return (
    <div className="flex items-center gap-3">
      <Checkbox />
      <span className="text-sm">{label}</span>
    </div>
  );
}

function SurgicalItem({ name, date }) {
  return (
    <div className="flex justify-between items-center border rounded-xl px-4 py-3">
      <span className="text-sm font-medium">{name}</span>
      <span className="text-sm text-gray-500">{date}</span>
    </div>
  );
}
