data {
  int<lower=0> N;
  int<lower=0> C;
  int cc[N];
  int y[N];
}

parameters {
  real<lower=0, upper=1> mu;
  real<lower=0> kappa;

  vector<lower=0, upper=1>[C] cond_mu;
}

model {
  vector[N] p;
  mu ~ beta(2, 2);
  kappa ~ gamma(1, .1);
  cond_mu ~ beta(mu*kappa, (1-mu)*kappa);
  for (n in 1:N) {
    p[n] = cond_mu[cc[n]];
  }
  y ~ bernoulli(p);
}
