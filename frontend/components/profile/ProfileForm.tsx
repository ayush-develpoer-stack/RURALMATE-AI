'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FiUser,
  FiMapPin,
  FiDollarSign,
  FiArrowRight,
  FiZap,
  FiTarget,
} from 'react-icons/fi';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useBusiness, DEMO_PROFILE } from '@/context/BusinessContext';
import { analysisService } from '@/services/analysis.service';
import { ApiRequestError } from '@/services/api';
import type {
  BusinessCategory,
  BusinessStatus,
  EntrepreneurProfile,
  ExperienceLevel,
} from '@/types/business';
import './ProfileForm.css';

const CATEGORY_OPTIONS = [
  { value: 'agriculture', label: 'Agriculture / Dairy' },
  { value: 'food-processing', label: 'Food Processing' },
  { value: 'handicraft', label: 'Handicraft / Bamboo' },
  { value: 'retail', label: 'Retail / Kirana' },
  { value: 'textile', label: 'Textile' },
  { value: 'services', label: 'Services' },
  { value: 'other', label: 'Other' },
];

const STATUS_OPTIONS = [
  { value: 'new', label: 'New Business' },
  { value: 'existing', label: 'Existing Business' },
];

const EXPERIENCE_OPTIONS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'experienced', label: 'Experienced' },
];

type FormState = {
  name: string;
  businessStatus: BusinessStatus;
  category: BusinessCategory;
  village: string;
  town: string;
  district: string;
  state: string;
  capital: string;
  experience: ExperienceLevel;
  goal: string;
  monthlyRevenue: string;
  monthlyExpenses: string;
  existingLoans: string;
};

const EMPTY: FormState = {
  name: '',
  businessStatus: 'new',
  category: 'agriculture',
  village: '',
  town: '',
  district: '',
  state: '',
  capital: '',
  experience: 'beginner',
  goal: '',
  monthlyRevenue: '',
  monthlyExpenses: '',
  existingLoans: '',
};

function composeLocation(f: Pick<FormState, 'village' | 'town' | 'district' | 'state'>): string {
  return [f.village, f.town, f.district, f.state]
    .map((s) => s.trim())
    .filter(Boolean)
    .join(', ');
}

function fromProfile(p: EntrepreneurProfile): FormState {
  const hasStructured = Boolean(p.village || p.town || p.district || p.state);
  return {
    name: p.name,
    businessStatus: p.businessStatus,
    category: p.category,
    village: p.village ?? '',
    town: p.town ?? '',
    district: p.district ?? '',
    // Backward compatibility: an older profile only has a single `location`
    // string — surface it in the State field so it can be refined.
    state: p.state ?? (hasStructured ? '' : p.location ?? ''),
    capital: String(p.capital),
    experience: p.experience,
    goal: p.goal,
    monthlyRevenue: p.monthlyRevenue ? String(p.monthlyRevenue) : '',
    monthlyExpenses: p.monthlyExpenses ? String(p.monthlyExpenses) : '',
    existingLoans: p.existingLoans ? String(p.existingLoans) : '',
  };
}

export default function ProfileForm() {
  const router = useRouter();
  const { profile, setProfile, setAnalysis } = useBusiness();
  const [form, setForm] = useState<FormState>(profile ? fromProfile(profile) : EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: '' }));
  };

  const loadDemo = () => {
    setForm(fromProfile(DEMO_PROFILE));
    setErrors({});
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.state.trim()) e.state = 'State is required';
    if (!form.district.trim()) e.district = 'District is required';
    if (!form.capital || Number(form.capital) <= 0) e.capital = 'Enter available capital';
    if (!form.goal.trim()) e.goal = 'Describe your business goal';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setSubmitError('');
    if (!validate()) return;

    const payload: EntrepreneurProfile = {
      name: form.name.trim(),
      businessStatus: form.businessStatus,
      category: form.category,
      village: form.village.trim() || undefined,
      town: form.town.trim() || undefined,
      district: form.district.trim() || undefined,
      state: form.state.trim() || undefined,
      location: composeLocation(form),
      capital: Number(form.capital),
      experience: form.experience,
      goal: form.goal.trim(),
      monthlyRevenue: form.monthlyRevenue ? Number(form.monthlyRevenue) : undefined,
      monthlyExpenses: form.monthlyExpenses ? Number(form.monthlyExpenses) : undefined,
      existingLoans: form.existingLoans ? Number(form.existingLoans) : undefined,
    };

    setLoading(true);
    try {
      await analysisService.submitProfile(payload);
      setProfile(payload);
      // Pre-fetch analysis so the next screen is instant.
      const analysis = await analysisService.analyze(payload);
      setAnalysis(analysis);
      router.push('/analysis');
    } catch (err) {
      setSubmitError(
        err instanceof ApiRequestError ? err.message : 'Unable to save profile. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <div className="profile-form__demo">
        <div>
          <strong>New here?</strong>{' '}
          <span className="text-secondary">Try the connected demo entrepreneur, Ravi.</span>
        </div>
        <Button type="button" variant="outline" size="sm" leftIcon={<FiZap />} onClick={loadDemo}>
          Use Ravi&apos;s Demo Profile
        </Button>
      </div>

      <Card>
        <h3 className="profile-form__section-title">Basic Details</h3>
        <div className="profile-form__grid">
          <Input
            label="Full Name"
            name="name"
            icon={<FiUser />}
            placeholder="e.g. Ravi"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            error={errors.name}
          />
          <Input
            label="Village"
            name="village"
            icon={<FiMapPin />}
            placeholder="e.g. Nasrullaganj"
            value={form.village}
            onChange={(e) => update('village', e.target.value)}
          />
          <Input
            label="Town"
            name="town"
            icon={<FiMapPin />}
            placeholder="e.g. Nasrullaganj"
            value={form.town}
            onChange={(e) => update('town', e.target.value)}
          />
          <Input
            label="District"
            name="district"
            icon={<FiMapPin />}
            placeholder="e.g. Sehore"
            value={form.district}
            onChange={(e) => update('district', e.target.value)}
            error={errors.district}
          />
          <Input
            label="State"
            name="state"
            icon={<FiMapPin />}
            placeholder="e.g. Madhya Pradesh"
            value={form.state}
            onChange={(e) => update('state', e.target.value)}
            error={errors.state}
          />
          <Select
            label="Business Status"
            name="businessStatus"
            options={STATUS_OPTIONS}
            value={form.businessStatus}
            onChange={(e) => update('businessStatus', e.target.value)}
          />
          <Select
            label="Business Category"
            name="category"
            options={CATEGORY_OPTIONS}
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
          />
          <Input
            label="Available Capital"
            name="capital"
            type="number"
            prefix="₹"
            placeholder="200000"
            value={form.capital}
            onChange={(e) => update('capital', e.target.value)}
            error={errors.capital}
          />
          <Select
            label="Experience"
            name="experience"
            options={EXPERIENCE_OPTIONS}
            value={form.experience}
            onChange={(e) => update('experience', e.target.value)}
          />
        </div>
        <div className="profile-form__full">
          <Textarea
            label="Business Goal"
            name="goal"
            placeholder="e.g. I want to start a profitable rural business."
            value={form.goal}
            onChange={(e) => update('goal', e.target.value)}
            error={errors.goal}
          />
        </div>
      </Card>

      <Card>
        <h3 className="profile-form__section-title">
          <FiTarget className="profile-form__inline-icon" /> Optional Financials
        </h3>
        <p className="profile-form__hint">
          These improve the finance and business-plan accuracy. You can skip them for now.
        </p>
        <div className="profile-form__grid">
          <Input
            label="Monthly Revenue (expected)"
            name="monthlyRevenue"
            type="number"
            prefix="₹"
            placeholder="75000"
            value={form.monthlyRevenue}
            onChange={(e) => update('monthlyRevenue', e.target.value)}
          />
          <Input
            label="Monthly Expenses (expected)"
            name="monthlyExpenses"
            type="number"
            prefix="₹"
            placeholder="48000"
            value={form.monthlyExpenses}
            onChange={(e) => update('monthlyExpenses', e.target.value)}
          />
          <Input
            label="Existing Loans"
            name="existingLoans"
            type="number"
            prefix="₹"
            placeholder="0"
            value={form.existingLoans}
            onChange={(e) => update('existingLoans', e.target.value)}
          />
        </div>
      </Card>

      {submitError && <div className="profile-form__error">{submitError}</div>}

      <div className="profile-form__actions">
        <Button
          type="submit"
          size="lg"
          loading={loading}
          leftIcon={<FiDollarSign />}
          rightIcon={<FiArrowRight />}
        >
          Analyze My Opportunity
        </Button>
      </div>
    </form>
  );
}
