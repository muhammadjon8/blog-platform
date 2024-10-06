import { User } from "./entities/entity.user";


declare global {
  namespace Express {
    interface Request {
      user?: User 
    }
  }
}

export {}