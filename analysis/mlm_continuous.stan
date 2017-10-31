data {
  int<lower=0> N;
  int<lower=0> C;
  int cc[N];
  vector[N] y;
}

parameters {
  real mu;
  real<lower=0> sigma;

  vector[C] cond_mu_raw;
  vector<lower=0>[C] cond_sigma;
}

transformed parameters {
  vector[C] cond_mu;
  cond_mu = cond_mu_raw * sigma + mu;
}

model {
  vector[N] muvec;
  vector[N] sigvec;
  mu ~ normal(.5, 1);
  sigma ~ normal(0, .5);
  cond_mu_raw ~ normal(0, 1);
  cond_sigma ~ normal(0, 1);
  for (n in 1:N) {
    muvec[n] = cond_mu[cc[n]];
    sigvec[n] = cond_sigma[cc[n]];
  }
  y ~ normal(muvec, sigvec);
}
