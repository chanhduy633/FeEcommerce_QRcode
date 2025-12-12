export interface ISpecification {
  _id?: string;
  product: string;
  brand?: string;
  model?: string;
  releaseYear?: number;
  warranty?: string;
  origin?: string;
  color?: string;
  material?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateSpecificationRequest {
  product: string;
  brand?: string;
  model?: string;
  releaseYear?: number;
  warranty?: string;
  origin?: string;
  color?: string;
  material?: string;
}

export interface IUpdateSpecificationRequest {
  brand?: string;
  model?: string;
  releaseYear?: number;
  warranty?: string;
  origin?: string;
  color?: string;
  material?: string;
}
