"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  User,
  AtSign,
  Mail,
  MapPin,
  MessageCircle,
  Text,
  X,
  Save,
  Pencil,
} from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProfile, type ProfileData } from "@/components/layout/profile-provider";

function generateInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name: string): string {
  const colors = [
    "from-[#6D5EF9] to-[#38BDF8]",
    "from-[#F472B6] to-[#EC4899]",
    "from-[#34D399] to-[#10B981]",
    "from-[#FBBF24] to-[#F59E0B]",
    "from-[#818CF8] to-[#6366F1]",
    "from-[#67E8F9] to-[#22D3EE]",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { profile, updateProfile } = useProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [draft, setDraft] = useState<ProfileData>(profile);
  const [isEditing, setIsEditing] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const handleEdit = () => {
    setDraft({ ...profile });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraft({ ...profile });
    setIsEditing(false);
  };

  const handleSave = () => {
    updateProfile(draft);
    setIsEditing(false);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setDraft((prev) => ({ ...prev, avatar: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setDraft((prev) => ({ ...prev, avatar: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const updateField = (field: keyof ProfileData, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const avatarSrc = isEditing ? draft.avatar : profile.avatar;
  const avatarName = isEditing ? draft.fullName : profile.fullName;
  const avatarGradient = getAvatarColor(avatarName || "Ava");

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100">
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1">
          <Navbar title="Profile Settings" />
          <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
            {/* Success notification */}
            <AnimatePresence>
              {showNotification && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="fixed right-6 top-6 z-50 flex items-center gap-3 rounded-[20px] border border-emerald-500/20 bg-emerald-500/10 px-5 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Profile saved</p>
                    <p className="text-xs text-zinc-400">Your changes have been saved successfully.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="space-y-6"
            >
              {/* Back button */}
              <button
                onClick={() => router.back()}
                className="mb-2 flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Settings
              </button>

              {/* Profile Header Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div
                        className={`flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br text-2xl font-semibold text-white shadow-[0_0_30px_rgba(109,94,249,0.2)] ${avatarGradient}`}
                      >
                        {avatarSrc ? (
                          <img
                            src={avatarSrc}
                            alt="Avatar"
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          generateInitials(avatarName || "Ava")
                        )}
                      </div>
                      {isEditing && (
                        <div className="absolute -bottom-1 -right-1 flex gap-1">
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-[#1C1C1F] text-zinc-300 shadow-lg transition-colors hover:bg-[#2C2C2F] hover:text-white"
                          >
                            <Camera className="h-3.5 w-3.5" />
                          </button>
                          {draft.avatar && (
                            <button
                              onClick={handleRemoveAvatar}
                              className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-[#1C1C1F] text-zinc-300 shadow-lg transition-colors hover:bg-red-500/20 hover:text-red-400"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{profile.fullName}</CardTitle>
                      <CardDescription className="mt-1">{profile.statusMessage}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {!isEditing ? (
                      <Button onClick={handleEdit}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Button>
                    ) : (
                      <>
                        <Button onClick={handleSave}>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </Button>
                        <Button variant="secondary" onClick={handleCancel}>
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Profile Fields Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal details and how others see you on Eunoia.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                      <User className="h-4 w-4 text-sky-400" />
                      Full Name
                    </label>
                    {isEditing ? (
                      <Input
                        value={draft.fullName}
                        onChange={(e) => updateField("fullName", e.target.value)}
                        placeholder="Your full name"
                      />
                    ) : (
                      <div className="rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-100">
                        {profile.fullName}
                      </div>
                    )}
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                      <AtSign className="h-4 w-4 text-sky-400" />
                      Username
                    </label>
                    {isEditing ? (
                      <Input
                        value={draft.username}
                        onChange={(e) => updateField("username", e.target.value)}
                        placeholder="Your username"
                      />
                    ) : (
                      <div className="rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-100">
                        @{profile.username}
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                      <Mail className="h-4 w-4 text-sky-400" />
                      Email
                    </label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={draft.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="your@email.com"
                      />
                    ) : (
                      <div className="rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-100">
                        {profile.email}
                      </div>
                    )}
                  </div>

                  {/* Status Message */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                      <MessageCircle className="h-4 w-4 text-sky-400" />
                      Status Message
                    </label>
                    {isEditing ? (
                      <Input
                        value={draft.statusMessage}
                        onChange={(e) => updateField("statusMessage", e.target.value)}
                        placeholder="How are you feeling?"
                      />
                    ) : (
                      <div className="rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-100">
                        {profile.statusMessage}
                      </div>
                    )}
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                      <Text className="h-4 w-4 text-sky-400" />
                      Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        value={draft.bio}
                        onChange={(e) => updateField("bio", e.target.value)}
                        placeholder="Write a short bio about yourself..."
                        rows={3}
                        className="flex w-full resize-none rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none ring-0 transition-all placeholder:text-zinc-500 focus:border-sky-400/50 focus:bg-white/10"
                      />
                    ) : (
                      <div className="rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-6 text-zinc-100">
                        {profile.bio}
                      </div>
                    )}
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                      <MapPin className="h-4 w-4 text-sky-400" />
                      Location <span className="text-xs text-zinc-500">(optional)</span>
                    </label>
                    {isEditing ? (
                      <Input
                        value={draft.location}
                        onChange={(e) => updateField("location", e.target.value)}
                        placeholder="City, Country"
                      />
                    ) : (
                      <div className="rounded-[22px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-zinc-100">
                        {profile.location || (
                          <span className="text-zinc-500 italic">Not specified</span>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Action buttons at the bottom */}
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-end gap-3"
                >
                  <Button variant="secondary" onClick={handleCancel}>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}