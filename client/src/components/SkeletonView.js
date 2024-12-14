import React from 'react';
import { Paper, Skeleton } from '@mui/material';

const SkeletonView = () => (
  <Paper elevation={3} sx={{ padding: 4, mt: 8 }}>
    <Skeleton variant="text" width="100%" height={40} sx={{ mb: 2 }} />
    <Skeleton variant="rectangular" height={48} sx={{ mb: 2 }} />
    <Skeleton variant="rectangular" height={48} sx={{ mb: 2 }} />
    <Skeleton variant="rectangular" height={48} />
  </Paper>
);

export default SkeletonView;