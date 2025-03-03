import { Router } from 'express';
import { RecommendationController } from '../controllers/recommendation.controller';

const router = Router();
const recommendationController = new RecommendationController();

router.post('/recommendations', recommendationController.getRecommendations);

export const movieRoutes = router; 