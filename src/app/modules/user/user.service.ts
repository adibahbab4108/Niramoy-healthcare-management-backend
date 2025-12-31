import bcrypt from "bcryptjs";
import { Request } from "express";
import { fileUploader } from "../../helper/fileUploader";
import { userSearchableFields } from "./user.constant";
import { paginationHelper } from "../../helper/paginationHelper";
import { Admin, Doctor, Prisma, UserRole } from "../../../../prisma/generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { envVar } from "../../../config/env.config";

// const createPatient = async (req: Request) => {
//   const { user: userData, patient: patientData } = req.body as CreatePatientPayload;
//   const file = req.file; // from multer

//   // 1. Validate required fields
//   if (!userData?.email || !userData?.password) {
//     throw new Error('Email and password are required');
//   }

//   // 2. Check if user already exists
//   const existingUser = await prisma.user.findUnique({
//     where: { email: userData.email },
//   });

//   if (existingUser) {
//     throw new Error('User with this email already exists');
//   }

//   const hashedPassword = await bcrypt.hash(
//     userData.password,
//     Number(envVar.BCRYPT_SALT_ROUND)
//   );

//   let profilePhotoUrl: string | undefined | null = patientData.profilePhoto || null

//   if (file) {
//     const uploadResult = await fileUploader.uploadToCloudinary(file);
//     if (uploadResult?.secure_url) {
//       profilePhotoUrl = uploadResult.secure_url;
//     }
//   }

//   const result = await prisma.user.create({
//     data: {
//       email: userData.email,
//       password: hashedPassword,
//       role: UserRole.PATIENT,
//       phone: userData.phone || null,
//       gender: userData.gender || null,

//       patient: {
//         create: {
//           name: patientData.name || null,
//           address: patientData.address || null,
//           profilePhoto: profilePhotoUrl || null,
//         },
//       },
//     },
//     include: {
//       patient: true,
//     },
//   });

//   return result;
// };
const createPatient = async (req: Request) => {

  if (req.file) {
    const uploadResult = await fileUploader.uploadToCloudinary(req.file)
    req.body.patient.profilePhoto = uploadResult?.secure_url
  }

  const hashPassword = await bcrypt.hash(req.body.password, 10);

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: req.body.patient.email,
        password: hashPassword
      }
    });
    
    return await tnx.patient.create({
      data: req.body.patient
    })
  })

  return result;
}

const createAdmin = async (req: Request): Promise<Admin> => {
  const file = req.file;
  const payload = req.body;
  console.log("Inside createAdmin", payload);
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.admin.profilePhoto = uploadToCloudinary?.secure_url;
  }

  const hashedPassword: string = await bcrypt.hash(req.body.password, 10);

  const userData = {
    email: req.body.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (transactionClient: Prisma.TransactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdAdminData = await transactionClient.admin.create({
      data: req.body.admin,
    });

    return createdAdminData;
  });

  return result;
};
const createDoctor = async (req: Request): Promise<Doctor> => {
  const file = req.file;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url;
  }
  const hashedPassword: string = await bcrypt.hash(req.body.password, 10);

  const userData = {
    email: req.body.doctor.email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
  };

  const result = await prisma.$transaction(async (transactionClient: Prisma.TransactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdDoctorData = await transactionClient.doctor.create({
      data: req.body.doctor,
    });

    return createdDoctorData;
  });

  return result;
};

const getAllFromDB = async (params: any, options: IOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.UserWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0
      ? {
        AND: andConditions,
      }
      : {};

  const result = await prisma.user.findMany({
    skip,
    take: limit,

    where: whereConditions,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const UserService = {
  createPatient,
  createAdmin,
  createDoctor,
  getAllFromDB,
};
