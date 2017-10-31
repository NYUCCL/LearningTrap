library("ggplot2")
library("dplyr")
library("tidyr")
library("RColorBrewer")
library("scales")
library("rstan")
rstan_options(auto_write = TRUE)
options(mc.cores = parallel::detectCores())
library("cowplot")

get_rule_proportions <- function(data, threshold=15/16, combine_test=TRUE) {
  if (combine_test) {
    max_learn_block <- max(data[!data$test, "block"])
    data <- data %>%
      mutate(block=ifelse(test, max_learn_block+1, block))
  }
  datarule <- data %>%
    mutate(block=block+1) %>%
    group_by(condition, block, uniqueid) %>%
    mutate(twodimrule = (!dim3 & !dim2 & !response) | ((dim3 | dim2) & response),
           onedimrule1 = (dim2 & response) | (!dim2 & !response),
           onedimrule2 = (dim3 & response) | (!dim3 & !response)) %>%
    summarize(twodimscore = mean(twodimrule),
              onedimscore1 = mean(onedimrule1),
              onedimscore2 = mean(onedimrule2)) %>%
    mutate(onedimscore = pmax(onedimscore1, onedimscore2)) %>%
    summarize(twodimprop = mean(twodimscore >= threshold),
              onedimprop = mean(onedimscore >= threshold)) %>%
    mutate(otherprop = 1 - onedimprop - twodimprop) %>%
    gather(strategy, proportion, -condition, -block) %>%
    mutate(
      strategy=revalue(strategy, c(twodimprop="two dim.",
                                   onedimprop="one dim.",
                                   otherprop="other"))
      ) %>%
    arrange(strategy)
  datarule
}

rules_graph <- function(rules) {
  maxblock <- max(rules$block)
  p <- ggplot(rules, aes(x=block, y=proportion, group=strategy)) +
    geom_area(aes(fill=strategy)) +
    facet_grid(.~condition) +
    theme(
      plot.background = element_rect(fill = "transparent",colour = NA),
      legend.background = element_rect(fill = "transparent",colour = NA)
    ) +
    scale_x_continuous(breaks=seq(1,maxblock,by=1),
                       labels = c(seq(1,maxblock-1,by=1), "test"),
                       limits = c(1, maxblock)) +
    scale_fill_manual(breaks=c('two dim.', 'one dim.'), values=c("#AA0000", alpha("#888888", .0),"#00CF44")) +
  theme_bw() +
    theme(panel.grid.major = element_line(colour = "#AAAAAA")) +
  theme(legend.position="bottom")
  p
}

fit_stan_model = function (conditions, y, stanfile, print=FALSE) {
  N = length(conditions)
  C = nlevels(factor(conditions))
  cc = as.numeric(factor(conditions))
  y = as.numeric(y)
  model = stan_model(file=stanfile)
  fit = sampling(model, data=c("N", "C", "cc", "y"), chains=4,
                 iter=5000, refresh=-1)
  if (print) {
    print(fit)
  }
  extracted = rstan::extract(fit, permuted=TRUE, pars="cond_mu")
  cond_mu = data.frame(extracted$cond_mu)
  colnames(cond_mu) = levels(factor(conditions))
  list('fit'=fit, 'cond_mu'=cond_mu)
}

create_stan_graph = function (cond_mu) {
  graph_data = cond_mu %>% gather(condition, sample) %>%
    group_by(condition) %>%
    summarize(
      meanval=mean(sample),
      pct975=quantile(sample, probs=.975, names=FALSE),
      pct025=quantile(sample, probs=.025, names=FALSE))

  ggplot(graph_data, aes(y=condition, color=condition, x=meanval, xmin=pct025, xmax=pct975)) + geom_point() +
    geom_errorbarh(height=.3) + guides(color=FALSE) + theme_minimal() +
    scale_y_discrete(limits = rev(levels(factor(graph_data$condition)))) + ylab("")
}

create_stan_pairwise = function (cond_mu) {
  conds = colnames(cond_mu)
  n = ncol(cond_mu)
  df = data.frame()
  for (i in 1:(n-1)){
    for (j in (i+1):n) {
      df = rbind.data.frame(df, list('cond1'=conds[i], 'cond2'=conds[j],
                                     'pct025'=quantile(cond_mu[[conds[j]]] - cond_mu[[conds[i]]], probs=.025, names=FALSE),
                                     'pct975'=quantile(cond_mu[[conds[j]]] - cond_mu[[conds[i]]], probs=.975, names=FALSE)
                                     ),
                            stringsAsFactors=FALSE)
    }
  }
  df$cond1 = as.factor(df$cond1)
  df$cond2 = as.factor(df$cond2)
  df
}
