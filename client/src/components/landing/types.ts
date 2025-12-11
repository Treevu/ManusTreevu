import React from 'react';

export enum PlanType {
  PERSONA = 'PERSONA',
  EMPRESA = 'EMPRESA',
  COMERCIO = 'COMERCIO'
}

export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlight?: boolean;
  cta: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: React.ElementType;
}

export interface ContactFormData {
  nombre: string;
  email: string;
  empresa: string;
  mensaje: string;
}

export enum UserRole {
  EMPLOYEE = 'EMPLOYEE',
  EMPLOYER = 'EMPLOYER',
  MERCHANT = 'MERCHANT'
}

export enum SubscriptionTier {
  FREE = 'FREE',
  PLUS = 'PLUS',
  PREMIUM = 'PREMIUM'
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  SETTINGS = 'SETTINGS',
  ANALYTICS = 'ANALYTICS'
}

export enum OfferType {
  DISCOUNT = 'DISCOUNT',
  CASHBACK = 'CASHBACK',
  COMPANY = 'COMPANY'
}

export enum ExpenseCategory {
  FOOD = 'FOOD',
  TRANSPORT = 'TRANSPORT',
  UTILITIES = 'UTILITIES',
  HEALTH = 'HEALTH',
  EDUCATION = 'EDUCATION',
  ENTERTAINMENT = 'ENTERTAINMENT',
  SHOPPING = 'SHOPPING',
  OTHER = 'OTHER'
}

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  date: Date | string;
  merchant: string;
  isFormal: boolean;
  lostSavings?: number;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  image: string;
  color: string;
}