# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

require 'database_cleaner'

DatabaseCleaner.strategy = :truncation
DatabaseCleaner.clean

specialty = ['Audiologist', 'Allergist', 'Anesthesiologist', 'Cardiologist', 'Dentist', 'Dermatologist', 'Endocrinologist', 'Gynecologist', 'Epidemiologist', 'Immunologist', 'Neurologist']
location = ['Upper West Side', 'Upper east Side', 'TriBeCa', 'Midtown', 'Chelsea', 'Flatiron District', 'West Village', 'East Village', 'Park Slope', 'Bay Ridge', 'Williamsburg', 'Greenpoint']

5.times do |doctor|
  Doctor.create(first_name: Faker::Name.first_name, last_name: Faker::Name.last_name, location: location.sample, specialty: specialty.sample)
end

Drug.create(name: 'Lipitor', rxcui: '153165')
Drug.create(name: 'Hydrocodone', rxcui: '5489')
Drug.create(name: 'Prinivil', rxcui: '203644')
Drug.create(name: 'Tenormin', rxcui: '152413')
Drug.create(name: 'Synthroid', rxcui: '224920')
Drug.create(name: 'Amoxicillin', rxcui: '723')
Drug.create(name: 'Toprol', rxcui: '865575')
Drug.create(name: 'Zithromax', rxcui: '196474')
# furosemide = Drug.create(name: 'Furosemide', rxcui: '4603')
# toprol = Drug.create(name: 'Toprol', rxcui: '865575')
# xanax = Drug.create(name: 'Xanax', rxcui: '202363')
# albuterol = Drug.create(name: 'Albuterol', rxcui: '435')
# prilosec = Drug.create(name: 'Prilosec', rxcui: '203345')
# zoloft = Drug.create(name: 'Zoloft', rxcui: '82728')
# zocor = Drug.create(name: 'Zocor', rxcui: '196503')
# glucophage = Drug.create(name: 'Glucophage', rxcui: '151827')
# motrin = Drug.create(name: 'Motrin', rxcui: '202488')
# dyazide = Drug.create(name: 'Dyazide', rxcui: '23742')
# ambien = Drug.create(name: 'Ambien', rxcui: '131725')
# keflex = Drug.create(name: 'Keflex', rxcui: '203167')
# nexium = Drug.create(name: 'Nexium', rxcui: '284799')
# prevacid = Drug.create(name: 'Prevacid', rxcui: '83156')
# lexapro = Drug.create(name: 'Lexapro', rxcui: '352741')
# prednisone = Drug.create(name: 'Prednisone', rxcui: '8640')
# zyrtec = Drug.create(name: 'Zyrtec', rxcui: '58930')
# singulair = Drug.create(name: 'Singulair', rxcui: '153889')
# celebrex = Drug.create(name: 'Celebrex', rxcui: '215927')
# prozac = Drug.create(name: 'Prozac', rxcui: '58827')
# fosamax = Drug.create(name: 'Fosamax', rxcui: '114265')
# metoprolol = Drug.create(name: 'Metoprolol', rxcui: '6918')
# premarin = Drug.create(name: 'Premarin', rxcui: '202896')
# levoxyl = Drug.create(name: 'Levoxyl', rxcui: '218002')
# ativan = Drug.create(name: 'Ativan', rxcui: '202479')
# allegra = Drug.create(name: 'Allegra', rxcui: '324026')
# plavix = Drug.create(name: 'Plavix', rxcui: '174742')
# effexor = Drug.create(name: 'Effexor', rxcui: '151692')
# micro_K = Drug.create(name: 'Micro-K', rxcui: '218365')
# protonix = Drug.create(name: 'Protonix', rxcui: '261624')
# propoxyphene = Drug.create(name: 'Propoxyphene', rxcui: '8785')
# advair = Drug.create(name: 'Advair', rxcui: '301543')
# coumadin = Drug.create(name: 'Coumadin', rxcui: '202421')
# tylenol = Drug.create(name: 'Tylenol', rxcui: '202433')
# klonopin = Drug.create(name: 'Klonopin', rxcui: '202585')
# neurontin = Drug.create(name: 'Neurontin', rxcui: '196498')
# flonase = Drug.create(name: 'Flonase', rxcui: '83373')
# amitriptyline = Drug.create(name: 'Amitriptyline', rxcui: '704')
# zantac = Drug.create(name: 'Zantac', rxcui: '152523')
# trazodone = Drug.create(name: 'Trazodone', rxcui: '10737')
# naproxen = Drug.create(name: 'Naproxen', rxcui: '7258')
# augmentin = Drug.create(name: 'Augmentin', rxcui: '151392')
# viagra = Drug.create(name: 'Viagra', rxcui: '190465')

duane_reade = Pharmacy.create(name: 'Duane Reade', location: '11 Broadway')
cvs = Pharmacy.create(name: 'CVS', location: '20 Park Avenue')

1.times do |user|
  User.create(first_name: Faker::Name.first_name, last_name: Faker::Name.last_name, email: Faker::Internet.email, password: 'password123')
end

Prescription.create(refills: 1, fill_duration: 1, start_date: Date.today, end_date: ((Date.today + 1) - 1), doctor_id: 1, pharmacy_id: 1, user_id: 1, drug_id: 1, dose_size: '100mg')
Prescription.create(refills: 3, fill_duration: 2, start_date: Date.today, end_date: ((Date.today + 2) - 1), doctor_id: 2, pharmacy_id: 2, user_id: 1, drug_id: 2, dose_size: '50mg')
Prescription.create(refills: 0, fill_duration: 9, start_date: Date.today, end_date: ((Date.today + 9) - 1), doctor_id: 3, pharmacy_id: 1, user_id: 1, drug_id: 3, dose_size: '500mg')
Prescription.create(refills: 0, fill_duration: 7, start_date: Date.today, end_date: ((Date.today + 7) - 1), doctor_id: 4, pharmacy_id: 2, user_id: 1, drug_id: 4, dose_size: '200mg')
Prescription.create(refills: 0, fill_duration: 1, start_date: Date.today, end_date: ((Date.today + 1) - 1), doctor_id: 5, pharmacy_id: 1, user_id: 1, drug_id: 5, dose_size: '75mg')
Prescription.create(refills: 0, fill_duration: 1, start_date: Date.today, end_date: ((Date.today + 1) - 1), doctor_id: 1, pharmacy_id: 2, user_id: 1, drug_id: 6, dose_size: '300mg')
Prescription.create(refills: 0, fill_duration: 1, start_date: Date.today, end_date: ((Date.today + 1) - 1), doctor_id: 2, pharmacy_id: 1, user_id: 1, drug_id: 7, dose_size: '10mg')
Prescription.create(refills: 0, fill_duration: 1, start_date: Date.today, end_date: ((Date.today + 1) - 1), doctor_id: 3, pharmacy_id: 2, user_id: 1, drug_id: 8, dose_size: '900mg')

ScheduledDose.create(time_of_day: 'morning', prescription_id: 1)
ScheduledDose.create(time_of_day: 'bedtime', prescription_id: 1)
ScheduledDose.create(time_of_day: 'bedtime', prescription_id: 1)
ScheduledDose.create(time_of_day: 'afternoon', prescription_id: 2)
ScheduledDose.create(time_of_day: 'morning', prescription_id: 3)
ScheduledDose.create(time_of_day: 'afternoon', prescription_id: 3)
ScheduledDose.create(time_of_day: 'evening', prescription_id: 3)
ScheduledDose.create(time_of_day: 'bedtime', prescription_id: 3)
ScheduledDose.create(time_of_day: 'evening', prescription_id: 4)
ScheduledDose.create(time_of_day: 'evening', prescription_id: 4)
ScheduledDose.create(time_of_day: 'morning', prescription_id: 5)
ScheduledDose.create(time_of_day: 'afternoon', prescription_id: 6)
ScheduledDose.create(time_of_day: 'afternoon', prescription_id: 6)
ScheduledDose.create(time_of_day: 'morning', prescription_id: 7)
ScheduledDose.create(time_of_day: 'afternoon', prescription_id: 7)
ScheduledDose.create(time_of_day: 'evening', prescription_id: 7)
ScheduledDose.create(time_of_day: 'bedtime', prescription_id: 7)
ScheduledDose.create(time_of_day: 'evening', prescription_id: 8)
ScheduledDose.create(time_of_day: 'evening', prescription_id: 8)

Drug.all[0].persist_interactions(User.all.first)
Drug.all[1].persist_interactions(User.all.first)
Drug.all[2].persist_interactions(User.all.first)
Drug.all[3].persist_interactions(User.all.first)
Drug.all[4].persist_interactions(User.all.first)
Drug.all[5].persist_interactions(User.all.first)
Drug.all[6].persist_interactions(User.all.first)
Drug.all[7].persist_interactions(User.all.first)

# 100.times do |prescription|
#   start_date = Date.today + rand(-30..30)
#   fill_duration = rand(1..20)
#   Prescription.create(refills: rand(1..5), fill_duration: fill_duration, start_date: start_date, end_date: ((start_date + fill_duration) - 1), doctor_id: rand(1..Doctor.all.count), pharmacy_id: rand(1..Pharmacy.all.count), user_id: rand(1..User.all.count), drug_id: rand(1..Drug.all.count), dose_size: "#{rand(20..500)}mg")
# end

# 100.times do |scheduled_doses|
#   times_of_day = {'0' =>  'morning', '1' => 'afternoon', '2' => 'evening', '3' => 'bedtime'}
#   ScheduledDose.create(time_of_day: times_of_day[rand(0..3).to_s], prescription_id: rand(1..Prescription.all.count))
# end

# 20.times do |interaction|
#   Interaction.create(description: Faker::Lorem.sentence)
# end

# 100.times do |drug_interaction|
#   DrugInteraction.create(drug_id: rand(1..Drug.all.count), interaction_id: rand(1..Interaction.all.count))
# end