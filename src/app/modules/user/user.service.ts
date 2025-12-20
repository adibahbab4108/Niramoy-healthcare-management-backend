import bcrypt from "bcryptjs";
import { Request } from "express";
import { fileUploader } from "../../helper/fileUploader";
import { userSearchableFields } from "./user.constant";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { Admin, Doctor, Prisma, UserRole } from "../../../../prisma/generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createPatient = async (request: Request) => {
  const payload = request.body;
  const file = request.file;
  const isExistingUser = await prisma.user.findUnique({
    where: { email: payload.patient.email },
  });

  if (isExistingUser) {
    throw new Error("User with this email already exists");
  }

  console.log("Payload:", payload, "File", file);
  const hashedPassword = await bcrypt.hash(payload.password, 10);
  console.log(hashedPassword);

  if (file) {
    const uploadResult = await fileUploader.uploadToCloudinary(file);
    payload.patient.profilePhoto = uploadResult?.secure_url;
  }

  const result = await prisma.$transaction(
    async (tnx: Prisma.TransactionClient) => {
      const user = await tnx.user.create({
        data: {
          email: payload.patient.email,
          password: hashedPassword,
        },
      });
      const patient = await tnx.patient.create({
        data: payload.patient,
      });
      return {
        user,
        patient,
      };
    }
  );
  return result;
};

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
