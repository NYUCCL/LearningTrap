data {
  int<lower=0> N;
  int cc[N];
  vector[N] y;
}

parameters {
  vector[2] cond_mu;
  vector<lower=0>[2] cond_sigma;
}

model {
  vector[N] muvec;
  vector[N] sigvec;
  cond_mu ~ normal(.5, 1);
  cond_sigma ~ normal(0, 1);
  for (n in 1:N) {
    muvec[n] = cond_mu[cc[n]];
    sigvec[n] = cond_sigma[cc[n]];
  }
  y ~ normal(muvec, sigvec);
}
